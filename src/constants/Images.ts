import gamesImage from "@images/games.png";
import logoImage from "@images/logo.png";
import nytLogoDarkImage from "@images/nyt-logo-dark.png";
import nytLogoImage from "@images/nyt-logo.png";
import winImage from "@images/win.png";

import { Image } from "react-native";

// Resolve asset URIs
export const logoImageUri = Image.resolveAssetSource(logoImage).uri;

export const nytLogoImageUri = Image.resolveAssetSource(nytLogoImage).uri;

export const nytLogoImageDarkUri =
  Image.resolveAssetSource(nytLogoDarkImage).uri;

export const gamesImageUri = Image.resolveAssetSource(gamesImage).uri;

export const winImageUri = Image.resolveAssetSource(winImage).uri;
