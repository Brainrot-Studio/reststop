#!/bin/bash

# Set the current directory.
DIR="$( cd "$( dirname "$0" )" && pwd )"

# Build the react project
cd $DIR/../src/renderer
npm run build

# Start the electron project
cd ../
npm run start