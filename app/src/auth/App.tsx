import { ThemeProvider } from "@emotion/react"
import { FC } from "react"
import { GlobalCSS } from "../components/Theme/GlobalCSS"
import { LocalizationContext } from "../localize/useLocalization"
import { defaultTheme } from "../theme/Theme"
import { SignInPage } from "./SignInPage"

export const App: FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <LocalizationContext.Provider value={{ language: null }}>
        <GlobalCSS />
        <SignInPage />
      </LocalizationContext.Provider>
    </ThemeProvider>
  )
}
