#!/usr/bin/env python3
"""
週次メトリクスレポート生成スクリプト
Claude Code Opsの使用状況を分析してレポートを出力する
"""

import json
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path


def load_logs(log_dir: str, days: int = 7) -> list[dict]:
    """指定日数分のログを読み込む"""
    logs = []
    log_path = Path(log_dir)
    cutoff = datetime.now() - timedelta(days=days)

    for log_file in sorted(log_path.glob("usage-*.jsonl")):
        date_str = log_file.stem.replace("usage-", "")
        try:
            file_date = datetime.strptime(date_str, "%Y-%m-%d")
            if file_date < cutoff:
                continue
        except ValueError:
            continue

        with open(log_file) as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        logs.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
    return logs


def generate_report(logs: list[dict]) -> str:
    """メトリクスレポートを生成"""
    if not logs:
        return "対象期間のデータがありません。"

    # セッション数
    sessions = set(log.get("session_id", "") for log in logs)

    # ツール使用頻度
    tool_counts = Counter(log.get("tool", "unknown") for log in logs)

    # ユーザー別使用量
    user_counts = Counter(log.get("user", "unknown") for log in logs)

    # 日別使用量
    daily_counts: dict[str, int] = defaultdict(int)
    for log in logs:
        ts = log.get("timestamp", "")
        if ts:
            day = ts[:10]
            daily_counts[day] += 1

    report = []
    report.append("=" * 50)
    report.append("  Claude Code Ops 週次メトリクスレポート")
    report.append(f"  生成日: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    report.append("=" * 50)
    report.append("")

    # サマリ
    report.append("## サマリ")
    report.append(f"  総ツール実行回数: {len(logs)}")
    report.append(f"  ユニークセッション数: {len(sessions)}")
    report.append(f"  アクティブユーザー数: {len(user_counts)}")
    report.append("")

    # ツール使用頻度
    report.append("## ツール使用頻度")
    for tool, count in tool_counts.most_common(10):
        bar = "#" * min(count, 30)
        report.append(f"  {tool:20s} {count:5d} {bar}")
    report.append("")

    # ユーザー別
    report.append("## ユーザー別使用量")
    for user, count in user_counts.most_common():
        report.append(f"  {user:20s} {count:5d}")
    report.append("")

    # 日別
    report.append("## 日別使用量")
    for day in sorted(daily_counts.keys()):
        count = daily_counts[day]
        bar = "#" * min(count, 30)
        report.append(f"  {day} {count:5d} {bar}")
    report.append("")

    return "\n".join(report)


def main():
    log_dir = ".claudeops/metrics/logs"
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 7

    logs = load_logs(log_dir, days)
    report = generate_report(logs)
    print(report)


if __name__ == "__main__":
    main()
