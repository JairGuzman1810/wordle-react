import gamesImage from "@images/games.png";
import logoImage from "@images/logo.png";
import ntyLogoImage from "@images/nty-logo.png";
import winImage from "@images/win.png";

import { Image } from "react-native";

// Resolve asset URIs
export const logoImageUri = Image.resolveAssetSource(logoImage).uri;

export const ntyLogoImageUri = Image.resolveAssetSource(ntyLogoImage).uri;

export const gamesImageUri = Image.resolveAssetSource(gamesImage).uri;

export const winImageUri = Image.resolveAssetSource(winImage).uri;
