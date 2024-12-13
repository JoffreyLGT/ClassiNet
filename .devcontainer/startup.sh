#!/bin/bash

# Set the working directory to the project's root
cd /workspace/ClassiNet

# Restore .NET dependencies
dotnet restore

# Set the working directory to the frontend
cd /workspace/ClassiNet/frontend

# Generate environment file and compile the frontend
npm run prestart && npm run prebuild && ng build
