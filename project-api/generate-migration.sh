#! /usr/bin/env bash

# Description: Generate new alembic migration version

# Auto generate migrations
alembic revision --autogenerate -m "revision"