# syntax=docker/dockerfile:1

# Create the user
# https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user
ARG REMOTE_USER

FROM node:${NODE_VERSION:-24.2.0}-slim
ARG REMOTE_USER REMOTE_GROUP=$REMOTE_USER

# Install Development Tools
USER root
RUN apt-get update -qq \
    && apt-get install --no-install-recommends -y \
        build-essential \
        git \
        libvips \
        pkg-config \
        ca-certificates \
        sudo \
        bash-completion \
        iputils-ping \
        net-tools iproute2 \
        openssh-client \
        nano \
        less \
        curl \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# RUN curl \
#     -L https://raw.githubusercontent.com/docker/compose/1.29.2/contrib/completion/bash/docker-compose \
#     -o /etc/bash_completion.d/docker-compose

# Create the user
RUN groupadd -r $REMOTE_GROUP \
    && useradd -m -r $REMOTE_USER -g $REMOTE_GROUP -s /bin/bash \
    && echo "$REMOTE_USER ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers
USER $REMOTE_USER
WORKDIR /home/$REMOTE_USER

CMD ["/bin/bash"]
