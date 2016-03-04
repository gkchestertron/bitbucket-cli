#!/bin/bash
node "`dirname $0`"/bb.js "$@" | less -R
