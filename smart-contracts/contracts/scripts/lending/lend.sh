#!/usr/bin/env bash

# load variables from config file
source "$(dirname ${BASH_SOURCE[0]})/config.sh"

# fund noop
goal app call \
    --app-id "$APP_ID" \
    -f "$LEND_ACCOUNT" \
    --fee 2000 \
    --app-arg "str:lend" \
    --foreign-asset $FOREIGN_ASSET \
    -o lend-noop.tx

# create asset transaction
goal asset send \
    -a 1 \
    --assetid $FOREIGN_ASSET \
    -t "$APP_ACCOUNT" \
    -f "$LEND_ACCOUNT" \
    -o send-asset.tx

# group transactions
cat lend-noop.tx send-asset.tx > list-combined.tx
goal clerk group -i list-combined.tx -o list-grouped.tx
goal clerk split -i list-grouped.tx -o list-split.tx

# sign individual transactions
goal clerk sign -i list-split-0.tx -o list-signed-0.tx
goal clerk sign -i list-split-1.tx -o list-signed-1.tx

# re-combine individually signed transactions
cat list-signed-0.tx list-signed-1.tx > list-signed-final.tx

## send transaction
goal clerk rawsend -f list-signed-final.tx
