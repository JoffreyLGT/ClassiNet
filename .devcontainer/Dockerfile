# Use the official .NET 9 SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS base

# Install the latest LTS version of Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# Install Angular CLI
RUN npm install -g @angular/cli

# Use bind mount to share project files instead of copying
VOLUME ["/workspace"]

# Conditional installation based on architecture
RUN if [ "$(uname -m)" = "x86_64" ]; then \
    dotnet tool install -g mlnet-linux-x64 --framework net9.0; \
    else dotnet tool install -g mlnet-linux-arm64 --framework net9.0; \
    fi

RUN dotnet tool install -g dotnet-ef

# Add .NET tools directory to PATH
ENV PATH="$PATH:/root/.dotnet/tools"