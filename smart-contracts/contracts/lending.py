from pyteal import *
from pyteal_helpers import program


def approval():
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

    return program.event(
        update=Seq(
            update(),
            Reject()
        )
    )


def clear():
    return Approve()
