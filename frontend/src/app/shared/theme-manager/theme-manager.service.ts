import { Injectable, signal } from "@angular/core";

/**
 * ThemeManagerService is a service responsible for managing the theme selection
 * within the application. It provides functionality to switch between "dark mode" and
 * "light mode," store user preferences, and initialize the theme settings upon application startup.
 *
 * The service uses local storage to remember the user's theme preference and updates
 * it accordingly whenever the theme is changed.
 *
 * It offers methods to explicitly set dark or light modes and includes a toggle function
 * to switch between the modes based on the current theme.
 *
 * The selectedTheme property represents the current theme of the application, allowing
 * for efficient updates and access to the theme state across different parts of the app.
 */
@Injectable({
  providedIn: "root",
})
export class ThemeManagerService {
  /**
   * Represents the currently selected theme within the application.
   *
   * The `selectedTheme` is a reactive signal which can take one of two string values:
   * - "pastel": Indicates a theme with light, muted colors.
   * - "dracula": Indicates a theme with darker, high-contrast colors.
   *
   * The initial state is set to "pastel".
   *
   * This variable can be used to dynamically alter the visual presentation of
   * the application based on user preferences or default settings.
   *
   * Changes to this signal can be observed to perform actions such as
   * updating the UI or saving user preferences.
   */
  selectedTheme = signal<"pastel" | "dracula">("pastel");

  /**
   * Enables the dark mode theme for the application.
   * This method sets the "data-theme" value in local storage to "dark"
   * and updates the application's selected theme to "dracula".
   *
   * @return {void} Does not return a value.
   */
  setDarkMode() {
    localStorage.setItem("data-theme", "dark");
    this.selectedTheme.set("dracula");
  }

  /**
   * Sets the application's theme to 'light mode'. This method updates
   * the user's theme preference in the local storage and changes the
   * current theme setting to 'pastel'.
   *
   * @return {void} This method does not return a value.
   */
  setLightMode() {
    localStorage.setItem("data-theme", "light");
    this.selectedTheme.set("pastel");
  }

  /**
   * Toggles the theme between dark mode and light mode based on the current selection.
   * If the currently selected theme is "pastel", it switches to dark mode.
   * Otherwise, it switches to light mode.
   * @return {void}
   */
  toggleTheme() {
    if (this.selectedTheme() === "pastel") {
      this.setDarkMode();
    } else {
      this.setLightMode();
    }
  }

  /**
   * Initializes the theme for the application by checking the user's stored preference in local storage.
   * Depending on the retrieved value, it sets the theme to either dark mode or light mode.
   * If no preference is found or the value is not "dark", it defaults to light mode.
   *
   * @return {void} Does not return a value but sets the theme of the application.
   */
  constructor() {
    const theme = localStorage.getItem("data-theme");
    switch (theme) {
      case "dark":
        this.setDarkMode();
        break;
      default:
        this.setLightMode();
        break;
    }
  }
}
