"""Optional local preview server for the Death Over Dinner (HK) website.

The website itself is a static site under ../frontend and works fine
opened directly as a file, or served by any static host. This server adds
two small things on top, neither of which the site depends on:

1. Serves the frontend so it's reachable at http://127.0.0.1:<port>/ with a
   proper origin (needed for the submission-logging fetch() call below to
   succeed at all -- it silently no-ops otherwise, by design).
2. Logs each "send invitation" / "copy text" action the wizard produces to
   a local rotating log file, purely so a host-side team can see what
   people are configuring locally during testing. No email is sent by this
   server and no data leaves the machine it runs on.

Run it with:
    python -m backend.app
    python -m backend.app --port 5050 --log-level DEBUG
"""

from __future__ import annotations

import argparse
import json
from dataclasses import replace

from flask import Flask, Response, jsonify, request, send_from_directory

from .config import Config
from .logging_setup import configure_logging


def create_app(config: Config | None = None) -> Flask:
    config = config or Config()
    logger = configure_logging(config)

    app = Flask(__name__, static_folder=None)
    app.config["DOD_CONFIG"] = config

    @app.get("/")
    def index() -> Response:
        return send_from_directory(config.static_dir, "index.html")

    @app.get("/<path:asset_path>")
    def static_asset(asset_path: str) -> Response:
        return send_from_directory(config.static_dir, asset_path)

    @app.get("/api/health")
    def health() -> Response:
        return jsonify({"status": "ok"})

    @app.post("/api/submissions")
    def log_submission() -> Response:
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            logger.warning("Rejected submission with non-JSON or non-object body")
            return jsonify({"error": "expected a JSON object"}), 400

        # Log only -- deliberately not persisted anywhere else. This is a
        # local development aid, not a data store.
        logger.info("submission action=%s payload=%s", payload.get("action", "unknown"), json.dumps(payload, ensure_ascii=False))
        return jsonify({"status": "logged"}), 201

    logger.info("App ready. Serving static files from %s", config.static_dir)
    return app


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", help="Override DOD_HOST")
    parser.add_argument("--port", type=int, help="Override DOD_PORT")
    parser.add_argument("--debug", action="store_true", help="Enable Flask debug mode")
    parser.add_argument("--log-level", help="Override DOD_LOG_LEVEL (e.g. DEBUG, INFO, WARNING)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    config = Config()
    overrides = {}
    if args.host:
        overrides["host"] = args.host
    if args.port:
        overrides["port"] = args.port
    if args.debug:
        overrides["debug"] = True
    if args.log_level:
        overrides["log_level"] = args.log_level.upper()
    if overrides:
        config = replace(config, **overrides)

    app = create_app(config)
    app.run(host=config.host, port=config.port, debug=config.debug)


if __name__ == "__main__":
    main()
