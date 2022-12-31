#!/usr/bin/env bash

# load variables from config file
source "$(dirname ${BASH_SOURCE[0]})/config.sh"

# claim debt noop
goal app call \
    --app-id "$APP_ID" \
    -f "$CREATOR_ACCOUNT" \
    --fee 2000 \
    --app-arg "str:claim_debt"