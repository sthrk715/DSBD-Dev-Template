#!/bin/bash
# Notification Hook: Slack通知
# SLACK_WEBHOOK_URL 環境変数が設定されている場合にSlackへ通知する

if [ -n "$CLAUDE_NOTIFICATION" ] && [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -s -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-type: application/json' \
        -d "{\"text\": \"Claude Code: $CLAUDE_NOTIFICATION\"}" \
        >/dev/null 2>&1
fi

exit 0
