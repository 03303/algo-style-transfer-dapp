# AI Services on Algorand: Style Transfer

This solution implements an online Style Transfer (AI model) service that runs
when users pay a certain amount of ALGOs.


## What is Style Transfer?

It is an AI technique that uses a model with two images as its inputs, (`Input` and `Style`),
the model then "merges" both in a single output image, transferring the `Style` image to the `Input` one.

For example:

- Input:

![Input](./docs/assets/input.jpg)

- Style:

![Style](./docs/assets/style.jpg)

- Result:

![Result](./docs/assets/result.jpeg)


## Setup

- NodeJS v10+: https://nodejs.org/en/
- NPM v6+: https://www.npmjs.com/get-npm
- Yarn v1.22+: https://classic.yarnpkg.com/en/docs/install

```shell script
git clone https://github.com/03303/algo-style-transfer-dapp.git
cd algo-style-transfer-dapp
export REACT_APP_SERVICES_ENDPOINT=http://localhost:7000
export REACT_APP_JWT_SECRET=SUPERsecret
yarn install
yarn start
```

Great, now your frontend is good to go.

Let's set up the backend now:
```shell script
git clone https://github.com/03303/algo-style-transfer.git
cd algo-style-transfer
docker build . -t tensorflow_flask
docker run -p 7000:7000 -dti tensorflow_flask
```

Now your solution is ready!

The frontend will run at `http://localhost:3000` and the backend
at `http://localhost:7000`.


## PureStake AlgoSigner:

In order to call the service and get amazing stylized images, you will need to install
the PureStake AlgoSigner Extension/Add-On in your browser:

Please refer to the installation steps here:
- https://www.purestake.com/technology/algosigner/


## Users Guide:

- Access the website (default: `http://localhost:3000`), when prompted to grant access to AlgoSigner, authorize it.
- All the Payments are in the Algorand's Testnet, so no need to spend real money here (not even in our live demo!).
- Now select an image as the `Input` (from computer of URL) and another one as the `Style`
(from computer, URL or also our Gallery).
- Now click on `Run` button to call the service's backend.
- Sign the Algorand Payment Transaction and wait for the service's response (~20s).
- You can now Compare and also download the stylized image!


## Live Demo (Algorand Testnet):

- https://algorand.nonsense.codes/


## Next Steps:

- Add QR Codes for users that do not have AlgoSigner installed.
- Integrate more AI Services (Object Detection, Speech-To-Text, Text-To-Speech, Sentiment Analysis, etc).


## References:

This repo was heavily based on:

- [SingularityNET Style Transfer dApp Frontend](https://github.com/singnet/snet-dapp/tree/master/src/assets/thirdPartyServices/snet/style_transfer)
- [Tensorflow's Neural style transfer](https://www.tensorflow.org/tutorials/generative/style_transfer)
