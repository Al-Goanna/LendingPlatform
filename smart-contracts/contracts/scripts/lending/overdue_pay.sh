#!/usr/bin/env bash

# load variables from config file
source "$(dirname ${BASH_SOURCE[0]})/config.sh"

# user opt in
goal asset send \
    -a 0 \
    --assetid $FOREIGN_ASSET \
    -t "$EXTRA_ACCOUNT" \
    -f "$EXTRA_ACCOUNT" \
    -o opt-in.tx

# fund noop
goal app call \
    --app-id "$APP_ID" \
    -f "$EXTRA_ACCOUNT" \
    --fee 3000 \
    --app-arg "str:pay" \
    --foreign-asset $FOREIGN_ASSET \
    --app-account "$LEND_ACCOUNT" \
    -o pay-noop.tx

# fund payment
goal clerk send \
    -a "$PAYBACK_PRICE" \
    -t "$APP_ACCOUNT" \
    -f "$EXTRA_ACCOUNT" \
    -o pay-payment.tx

# group transactions
cat opt-in.tx pay-noop.tx pay-payment.tx > list-combined.tx
goal clerk group -i list-combined.tx -o list-grouped.tx
goal clerk split -i list-grouped.tx -o list-split.tx

# sign individual transactions
goal clerk sign -i list-split-0.tx -o list-signed-0.tx
goal clerk sign -i list-split-1.tx -o list-signed-1.tx
goal clerk sign -i list-split-2.tx -o list-signed-2.tx

# re-combine individually signed transactions
cat list-signed-0.tx list-signed-1.tx list-signed-2.tx > list-signed-final.tx

## send transaction
goal clerk rawsend -f list-signed-final.tx
