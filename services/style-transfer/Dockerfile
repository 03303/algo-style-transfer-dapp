FROM tensorflow/tensorflow:2.4.1

ENV SERVICE_NAME=style-transfer
ENV PROJECT_DIRECTORY=/opt/${SERVICE_NAME}

RUN mkdir -p ${PROJECT_DIRECTORY}
WORKDIR ${PROJECT_DIRECTORY}

RUN apt-get update && \
    apt-get install -y \
    git \
    wget \
    nano \
    curl

# # OpenCV dependencies
# RUN apt-get install -y libglib2.0-0 libsm6 libxext6 libxrender-dev

# RUN cd ${SINGNET_REPOS} && \
#     git clone -b ${git_branch} https://github.com/${git_owner}/${DNN_REPO_NAME}.git

ADD . .

RUN python -m pip install -U pip && \
    python -m pip install -r requirements.txt
