# Useful commands

goal account list
goal app info --app-id 1
goal app create --creator $ONE --approval-prog /data/build/approval.teal --clear-prog /data/build/clear.teal --global-byteslices 1 --global-ints 2 --local-byteslices 0 --local-ints 0
goal app read --global --from $ONE --app-id 1 --guess-format
goal app read --global --app-id 1 --guess-format