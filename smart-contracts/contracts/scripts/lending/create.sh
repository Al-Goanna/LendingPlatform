#!/usr/bin/env bash

# load variables from config file
source "$(dirname ${BASH_SOURCE[0]})/config.sh"

goal app create \
    --creator "$CREATOR_ACCOUNT" \
    --approval-prog /data/build/approval.teal \
    --clear-prog /data/build/clear.teal \
    --global-byteslices 2 \
    --global-ints 6 \
    --local-byteslices 0 \
    --local-ints 0