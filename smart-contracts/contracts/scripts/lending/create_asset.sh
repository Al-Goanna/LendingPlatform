#!/usr/bin/env bash

# load variables from config file
source "$(dirname ${BASH_SOURCE[0]})/config.sh"

goal asset create --creator "$LEND_ACCOUNT" --total 100 --no-clawback --no-freezer