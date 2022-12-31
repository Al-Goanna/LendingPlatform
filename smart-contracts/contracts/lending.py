from pyteal import *
from pyteal_helpers import program


def approval():
    # globals
    global_lend_asset = Bytes("global_lend_asset")  # uint64
    global_lend_amount = Bytes("global_lend_amount")  # uint64
    global_lend_paid = Bytes("global_lend_paid")  # uint64
    global_lend_date = Bytes("global_lend_date")  # uint64
    global_lend_time = Bytes("global_lend_time")  # uint64
    global_lend_payback = Bytes("global_lend_payback")  # uint64
    global_lend_status = Bytes("global_lend_status")  # byteslice
    global_lend_address = Bytes("global_lend_address")  # byteslice

    op_lend = Bytes("lend")
    op_setup = Bytes("setup")
    op_pay = Bytes("pay")
    op_partial_pay = Bytes("partial_pay")
    op_claim_debt = Bytes("claim_debt")
    op_claim_nft = Bytes("claim_nft")

    # Function for escrow to opt into asset id
    @Subroutine(TealType.none)
    def contract_opt_into_asset(asset_id):
        return Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields
            (
                {
                    TxnField.type_enum: TxnType.AssetTransfer,
                    TxnField.xfer_asset: asset_id,
                    TxnField.fee: Int(0),
                    TxnField.asset_receiver: Global.current_application_address(),
                }
            ),
            InnerTxnBuilder.Submit(),
        )

    # Function to send asset transfer transaction
    @Subroutine(TealType.none)
    def asset_transfer(asset_id, receiver, amount):
        return Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields
            (
                {
                    TxnField.type_enum: TxnType.AssetTransfer,
                    TxnField.xfer_asset: asset_id,
                    TxnField.asset_receiver: receiver,
                    TxnField.fee: Int(0),
                    TxnField.asset_amount: amount
                }
            ),
            InnerTxnBuilder.Submit()
        )

    # Function to send payment transaction
    @Subroutine(TealType.none)
    def payment(receiver, amount):
        return Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields
            (
                {
                    TxnField.type_enum: TxnType.Payment,
                    TxnField.receiver: receiver,
                    TxnField.fee: Int(0),
                    TxnField.amount: amount,
                }
            ),
            InnerTxnBuilder.Submit()
        )

    @Subroutine(TealType.none)
    def init():
        return Seq(
            program.check_self(
                group_size=Int(1),
                group_index=Int(0)
            ),
            program.check_rekey_zero(1),
            Assert(
                And(
                    Gtxn[0].type_enum() == TxnType.ApplicationCall,
                    Gtxn[0].fee() == Global.min_txn_fee(),
                )
            ),

            Approve()
        )

    @Subroutine(TealType.none)
    def update():
        return Seq(
            program.check_self(
                group_size=Int(1),
                group_index=Int(0)
            ),
            program.check_rekey_zero(1),
            Assert(
                And(
                    Gtxn[0].type_enum() == TxnType.ApplicationCall,
                    Gtxn[0].application_id() == Global.current_application_id(),
                    Gtxn[0].fee() == Global.min_txn_fee(),
                    Gtxn[0].sender() == Global.creator_address(),
                )
            ),

            Approve()
        )

    @Subroutine(TealType.none)
    def delete():
        return Seq(
            program.check_self(
                group_size=Int(1),
                group_index=Int(0)
            ),
            program.check_rekey_zero(1),
            Assert(
                And(
                    Gtxn[0].type_enum() == TxnType.ApplicationCall,
                    Gtxn[0].application_id() == Global.current_application_id(),
                    Gtxn[0].fee() == Global.min_txn_fee(),
                    Gtxn[0].sender() == Global.creator_address(),

                    # Check paid
                    App.globalGet(global_lend_status) == Bytes("paid"),
                )
            ),

            Approve()
        )

    @Subroutine(TealType.none)
    def setup_contract():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(1)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[0].type_enum() == TxnType.Payment,
                    Gtxn[0].fee() == Global.min_txn_fee(),
                    Gtxn[0].receiver() == Global.current_application_address(),
                    Gtxn[0].amount() > Int(200000),

                    Gtxn[1].type_enum() == TxnType.ApplicationCall,
                    Gtxn[1].application_id() == Global.current_application_id(),
                    Gtxn[1].sender() == Global.creator_address(),
                    Gtxn[1].fee() == Global.min_txn_fee() * Int(2),
                    # Check payback price above lend price
                    Btoi(Gtxn[1].application_args[1]) > Gtxn[0].amount() - Int(200000),
                    # Check payback time is above 0
                    Btoi(Gtxn[1].application_args[2]) > Int(0),
                )
            ),

            # Opt into the asset to be lent
            contract_opt_into_asset(Gtxn[1].assets[0]),

            # Set asset id, amount and status in global state
            App.globalPut(global_lend_asset, Gtxn[1].assets[0]),
            App.globalPut(global_lend_amount, Gtxn[0].amount() - Int(200000)),
            App.globalPut(global_lend_paid, Int(0)),
            App.globalPut(global_lend_status, Bytes("funded")),
            App.globalPut(global_lend_payback, Btoi(Gtxn[1].application_args[1])),
            App.globalPut(global_lend_time, Btoi(Gtxn[1].application_args[2])),

            Approve()
        )

    @Subroutine(TealType.none)
    def lend_nft():
        asset_freeze = AssetParam.freeze(Gtxn[0].assets[0])
        asset_clawback = AssetParam.clawback(Gtxn[0].assets[0])

        return Seq(
            asset_freeze,
            asset_clawback,
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    # Check the smart contract is funded
                    App.globalGet(global_lend_status) == Bytes("funded"),

                    # Check no clawback/freeze
                    asset_freeze.value() == Global.zero_address(),
                    asset_clawback.value() == Global.zero_address(),

                    Gtxn[0].type_enum() == TxnType.ApplicationCall,
                    Gtxn[0].application_id() == Global.current_application_id(),
                    Gtxn[0].fee() == Global.min_txn_fee() * Int(2),
                    Gtxn[0].assets[0] == Gtxn[1].xfer_asset(),

                    Gtxn[1].type_enum() == TxnType.AssetTransfer,
                    Gtxn[1].fee() == Global.min_txn_fee(),
                    Gtxn[1].asset_receiver() == Global.current_application_address(),
                    Gtxn[1].xfer_asset() == App.globalGet(global_lend_asset),
                    Gtxn[1].asset_amount() == Int(1),
                )
            ),

            payment(Gtxn[1].sender(), Balance(Global.current_application_address()) -
                    MinBalance(Global.current_application_address())),
            App.globalPut(global_lend_status, Bytes("lent")),
            App.globalPut(global_lend_address, Gtxn[1].sender()),
            App.globalPut(global_lend_date, Global.latest_timestamp()),

            Approve()
        )

    @Subroutine(TealType.none)
    def pay_debt():
        return Seq(
            program.check_self(
                group_size=Int(3),
                group_index=Int(1)
            ),
            program.check_rekey_zero(3),
            If(Global.latest_timestamp() < App.globalGet(global_lend_date) + App.globalGet(global_lend_time)).Then(
                Assert(
                    And(
                        Gtxn[2].sender() == App.globalGet(global_lend_address),
                        Gtxn[2].amount() == App.globalGet(global_lend_payback) - App.globalGet(global_lend_paid),
                    )
                ),
            ).Else(
                Assert(
                    Gtxn[2].amount() == App.globalGet(global_lend_payback),
                )
            ),
            Assert(
                And(
                    # Check the smart contract has the asset lent
                    App.globalGet(global_lend_status) == Bytes("lent"),

                    # User Opt In to asset
                    Gtxn[0].type_enum() == TxnType.AssetTransfer,
                    Gtxn[0].fee() == Global.min_txn_fee(),
                    Gtxn[0].sender() == Gtxn[0].asset_receiver(),
                    Gtxn[0].xfer_asset() == App.globalGet(global_lend_asset),
                    Gtxn[0].asset_amount() == Int(0),
                    Gtxn[0].asset_close_to() == Global.zero_address(),

                    Gtxn[1].type_enum() == TxnType.ApplicationCall,
                    Gtxn[1].application_id() == Global.current_application_id(),
                    Gtxn[1].fee() == Global.min_txn_fee() * Int(3),
                    Gtxn[1].assets[0] == App.globalGet(global_lend_asset),

                    Gtxn[2].type_enum() == TxnType.Payment,
                    Gtxn[2].fee() == Global.min_txn_fee(),
                    Gtxn[2].receiver() == Global.current_application_address(),
                )
            ),

            If(
                Gtxn[2].sender() != App.globalGet(global_lend_address),
            ).Then(
                payment(App.globalGet(global_lend_address), App.globalGet(global_lend_paid))
            ),

            asset_transfer(App.globalGet(global_lend_asset), Gtxn[2].sender(), Int(1)),
            App.globalPut(global_lend_paid, App.globalGet(global_lend_payback)),
            App.globalPut(global_lend_status, Bytes("paid")),

            Approve()
        )

    @Subroutine(TealType.none)
    def partial_pay_debt():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    # Check the smart contract has the asset lent
                    App.globalGet(global_lend_status) == Bytes("lent"),

                    Gtxn[0].type_enum() == TxnType.ApplicationCall,
                    Gtxn[0].application_id() == Global.current_application_id(),
                    Gtxn[0].fee() == Global.min_txn_fee() * Int(2),
                    Gtxn[0].assets[0] == App.globalGet(global_lend_asset),

                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].fee() == Global.min_txn_fee(),
                    Gtxn[1].sender() == App.globalGet(global_lend_address),
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].amount() < App.globalGet(global_lend_payback) - App.globalGet(global_lend_paid),
                )
            ),

            App.globalPut(global_lend_paid, App.globalGet(global_lend_paid) + Gtxn[1].amount()),

            Approve()
        )

    @Subroutine(TealType.none)
    def claim_debt():
        return Seq(
            program.check_self(
                group_size=Int(1),
                group_index=Int(0)
            ),
            program.check_rekey_zero(1),
            Assert(
                And(
                    # Check the debt has been paid
                    App.globalGet(global_lend_status) == Bytes("paid"),

                    Gtxn[0].type_enum() == TxnType.ApplicationCall,
                    Gtxn[0].application_id() == Global.current_application_id(),
                    Gtxn[0].sender() == Global.creator_address(),
                    Gtxn[0].fee() == Global.min_txn_fee() * Int(2),
                )
            ),

            payment(Global.creator_address(), Balance(Global.current_application_address()) -
                    MinBalance(Global.current_application_address())),

            App.globalPut(global_lend_status, Bytes("debt_claimed")),

            Approve()
        )

    @Subroutine(TealType.none)
    def claim_nft():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(1)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    # Check the debt hasn't been paid
                    App.globalGet(global_lend_status) == Bytes("lent"),

                    # Check the debt is overdue
                    Global.latest_timestamp() > App.globalGet(global_lend_date) + App.globalGet(global_lend_time),

                    # User Opt In to asset
                    Gtxn[0].type_enum() == TxnType.AssetTransfer,
                    Gtxn[0].fee() == Global.min_txn_fee(),
                    Gtxn[0].sender() == Global.creator_address(),
                    Gtxn[0].asset_receiver() == Global.creator_address(),
                    Gtxn[0].xfer_asset() == App.globalGet(global_lend_asset),
                    Gtxn[0].asset_amount() == Int(0),
                    Gtxn[0].asset_close_to() == Global.zero_address(),

                    Gtxn[1].type_enum() == TxnType.ApplicationCall,
                    Gtxn[1].application_id() == Global.current_application_id(),
                    Gtxn[1].sender() == Global.creator_address(),
                    Gtxn[1].fee() == Global.min_txn_fee() * Int(2),
                    Gtxn[1].assets[0] == App.globalGet(global_lend_asset),
                )
            ),

            asset_transfer(App.globalGet(global_lend_asset), Global.creator_address(), Int(1)),

            App.globalPut(global_lend_status, Bytes("nft_claimed")),

            Approve()
        )

    return program.event(
        init=Seq(
            init(),
            Reject()
        ),
        opt_in=Reject(),
        no_op=Seq(
            Cond(
                [
                    Txn.application_args[0] == op_setup,
                    setup_contract(),
                ],
                [
                    Txn.application_args[0] == op_lend,
                    lend_nft(),
                ],
                [
                    Txn.application_args[0] == op_pay,
                    pay_debt(),
                ],
                [
                    Txn.application_args[0] == op_partial_pay,
                    partial_pay_debt(),
                ],
                [
                    Txn.application_args[0] == op_claim_debt,
                    claim_debt(),
                ],
                [
                    Txn.application_args[0] == op_claim_nft,
                    claim_nft(),
                ],
            ),
            Reject(),
        ),
        delete=Seq(
            delete(),
            Reject()
        ),
        update=Seq(
            update(),
            Reject()
        )
    )


def clear():
    return Approve()
