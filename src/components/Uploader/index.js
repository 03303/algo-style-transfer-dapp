import React from "react";
import Button from "@material-ui/core/Button";
import { Grid, MuiThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";
import { createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import grey from "@material-ui/core/es/colors/grey";
import red from "@material-ui/core/es/colors/red";

import {
	AlgoSignerConnect,
	AlgoSignerAccounts,
	AlgoSignerSign,
  AlgoSignerSendTx,
  AlgoSignerCheckTx
} from '../../AlgoSigner';

import { GetStyleTransferResponse } from '../../helpers/interface';

import HoverIcon from "./HoverIcon";
import SNETImageUpload from "./SNETImageUpload";

const STYLE_TRANSFER_ACCOUNT = 'JTEAQYLZW22LQUB2AOQXGG2SQM3K7FWABHFKKF24GLP5EGEZ5YVYJSFKDY'
const STYLE_TRANSFER_PRICE = 10000
const STYLE_TRANSFER_NOTE = 'AlgorandStyleTransfer'

const initialUserInput = {
  // Actual inputs
  content: "",
  style: "",
  contentSize: 640,
  styleSize: 640,
  preserveColor: false,
  alpha: 1.0, // 0 to 1
  crop: false,
  saveExt: "",
};


export default class Uploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialUserInput,
      useAlgoSigner: false,
      accounts: [],
      processingTx: false,
      isComplete: false,
      response: undefined,
    };

    this.mainFont = "Muli";
    this.mainFontSize = 14;

    this.users_guide = "https://github.com/03303/algo-style-transfer-dapp";
    this.code_repo = "https://github.com/03303/algo-style-transfer-dapp";
    this.reference = "https://www.tensorflow.org/tutorials/generative/style_transfer";

    this.styleGallery = [
      "https://raw.githubusercontent.com/dxyang/StyleTransfer/master/style_imgs/mosaic.jpg",
      "https://raw.githubusercontent.com/ShafeenTejani/fast-style-transfer/master/examples/dora-maar-picasso.jpg",
      "https://raw.githubusercontent.com/singnet/style-transfer-service/master/docs/assets/input/style/brushstrokes.jpg",
      "https://raw.githubusercontent.com/singnet/style-transfer-service/master/docs/assets/examples/impronte_d_artista_cropped.jpg",
      "https://raw.githubusercontent.com/singnet/style-transfer-service/master/docs/assets/examples/woman_with_hat_matisse_cropped.jpg",
      "https://raw.githubusercontent.com/singnet/style-transfer-service/master/docs/assets/examples/sketch_cropped.png",
      "https://raw.githubusercontent.com/singnet/style-transfer-service/master/docs/assets/examples/ashville_cropped.jpg",
      "https://raw.githubusercontent.com/singnet/style-transfer-service/master/docs/assets/examples/goeritz_cropped.jpg",
      "https://raw.githubusercontent.com/singnet/style-transfer-service/master/docs/assets/examples/en_campo_gris_cropped.jpg",
    ];

    this.runService = this.runService.bind(this);
    this.canBeInvoked = this.canBeInvoked.bind(this);
    this.reset = this.reset.bind(this);

    this.getContentImageData = this.getContentImageData.bind(this);
    this.getStyleImageData = this.getStyleImageData.bind(this);

    // Color Palette
    this.theme = createMuiTheme({
      palette: {
        primary: blue,
        secondary: grey,
      },
      typography: {
        useNextVariants: true,
      },
      overrides: {
        MuiIconButton: {
          // Name of the component ⚛️ / style sheet
          colorPrimary: blue[500],
          colorSecondary: grey[500],
        },
        MuiSvgIcon: {
          colorPrimary: red[500],
          colorSecondary: grey[500],
        },
      },
    });
  }

  parseResponse() {
    const { response } = this.state;
    if (typeof response !== "undefined") {
      if (typeof response === "string") {
        return response;
      }
      return response.data;
    }
    return null;
  }

  getContentImageData(data) {
    this.setState({ content: data });
  }

  getStyleImageData(data) {
    this.setState({ style: data });
  }

  reset() {
    this.setState({ isComplete: false, processingTx: false, content: "", style: "", response: undefined });
  }

  canBeInvoked() {
    return this.state.content && this.state.style && !this.state.processingTx;
  }

	// Set AlgoSigner, asking for users access
	setup = async () => {
		const ok = await AlgoSignerConnect();
		if (ok) {
			const accounts = await AlgoSignerAccounts();
			this.setState({ useAlgoSigner: true, accounts: accounts });
		}
	}

	runService = async () => {
    try {
      const { useAlgoSigner, accounts, content, style } = this.state;
      if (useAlgoSigner && accounts.length) {
        const params = {
          from: accounts[0]['address'],
          to: STYLE_TRANSFER_ACCOUNT,
          amount: STYLE_TRANSFER_PRICE,
          note: STYLE_TRANSFER_NOTE
        };
        this.setState({ processingTx: true });
        const signedTx = await AlgoSignerSign(params);
        const sentTx = await AlgoSignerSendTx(signedTx);
        const txStatus = await AlgoSignerCheckTx(sentTx);
        if (txStatus) {
          const response = await GetStyleTransferResponse(content, style);
          if (response && response.data) {
            this.setState({ isComplete: true, response: response.data.output });
          }
        }
      } else {
        alert('AlgoSigner not installed!\nhttps://www.purestake.com/technology/algosigner/')
      }
    } catch(e) {
      console.error(e)
    }
    this.setState({ processingTx: false });
	}

	async componentDidMount() {
		await this.setup();
	}
    
  render() {
    const { isComplete, processingTx } =  this.state;
    return (
      <div style={{ flexGrow: 1 }}>
        <Grid item container justify="center" style={{ padding: 8 }}>
          <Paper
            style={{
              padding: 8 * 2,
              margin: "auto",
              width: "100%",
              maxWidth: 550,
            }}
          >
            <MuiThemeProvider theme={this.theme}>
              <Grid container spacing={0} justify="center" alignItems="center">
                <Grid item xs={12} container alignItems="center" justify="space-between">
                  <Grid item>
                    <Typography
                      style={{
                        fontFamily: this.mainFont,
                        fontSize: (this.mainFontSize * 4) / 3,
                      }}
                    >
                      Algorand Style Transfer
                    </Typography>
                  </Grid>
                  <Grid item xs container justify="flex-end">
                    <Grid item>
                      <HoverIcon text="View code on Github" href={this.code_repo}>
                        <SvgIcon>
                          <path // Github Icon
                            d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z"
                          />
                        </SvgIcon>
                      </HoverIcon>
                    </Grid>
                    <Grid item>
                      <HoverIcon text="User's guide" href={this.users_guide}>
                        <InfoIcon />
                      </HoverIcon>
                    </Grid>
                    <Grid item>
                      <HoverIcon text="View original project" href={this.reference}>
                        <SvgIcon>
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z" />
                        </SvgIcon>
                      </HoverIcon>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} container justify="center">
                  <SNETImageUpload
                    style={{ align: "center" }}
                    maxImageSize={3000000}
                    maxImageWidth={2400}
                    maxImageHeight={1800}
                    imageDataFunc={this.getContentImageData}
                    imageName="Input"
                    outputImage={this.parseResponse()}
                    outputImageName="stylizedImage"
                    width="90%"
                    instantUrlFetch={true}
                    allowURL={true}
                  />
                </Grid>
                {!isComplete && 
                  <Grid item xs={12} container justify="center">
                    <SNETImageUpload
                      imageDataFunc={this.getStyleImageData}
                      imageName="Style"
                      maxImageSize={3000000}
                      maxImageWidth={2400}
                      maxImageHeight={1800}
                      disableResetButton={isComplete}
                      width="90%"
                      instantUrlFetch={true}
                      allowURL={true}
                      imageGallery={this.styleGallery}
                    />
                  </Grid>
                }
              </Grid>
              {!isComplete && 
                <Grid item container justify="center" style={{ paddingTop: 16 }}>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="medium"
                      color="primary"
                      style={{ fontSize: "13px", marginLeft: "10px" }}
                      onClick={this.runService}
                      disabled={!this.canBeInvoked()}
                    >
                    {processingTx ? "Plese Wait" : "Run"}
                    </Button>
                  </Grid>
                </Grid>
              }
              {isComplete && 
                <Grid item container justify="center" style={{ paddingTop: 16 }}>
                    <Grid item>
                        <Button
                          variant="contained"
                          size="medium"
                          color="primary"
                          style={{ fontSize: "13px", marginLeft: "10px" }}
                          onClick={this.reset}
                        >
                        Reset
                        </Button>
                    </Grid>
                </Grid>
              }
            </MuiThemeProvider>
          </Paper>
        </Grid>
      </div>
    );
  }
}
