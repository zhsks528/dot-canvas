import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	* {
		outline: 0;
		margin: 0;
		padding: 0;
  	}
	
	#root {
		height: 100%;
	}

  	html {
		width: 100%;
		height: 100%;
		overflow: hidden;
  	}
  
  	body {
		width: 100%;
		height: 100%;
		background-color: #000;
		position: relative;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    				"Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
   					 sans-serif;
  					-webkit-font-smoothing: antialiased;
  					-moz-osx-font-smoothing: grayscale;
	}
	
	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
	}

`;

export default GlobalStyle;
