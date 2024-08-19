import { Stack } from "react-bootstrap";
import { useTodoList, useTodoListDispatch } from "../../../context";
import { BackgroundColor, BsThemes, IAction, IThemeSettings, TodoActions } from "../../../models";
import { useState } from "react";

export function ThemeSettings() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [top, setTop] = useState(todoList.settings.theme.primaryColorTopCord);
  const [left, setLeft] = useState(todoList.settings.theme.primaryColorLefCord);

  const areas = [
    { coords: "63,0,72,4,72,15,63,19,54,15,54,4", color: "#003366", position: {x: -200, y: 54} },
    { coords: "81,0,90,4,90,15,81,19,72,15,72,4", color: '#336699', position: {x: -200, y: 72} },
    { coords: "99,0,108,4,108,15,99,19,90,15,90,4", color: '#3366CC', position: {x: -200, y: 90} },
    { coords: "117,0,126,4,126,15,117,19,108,15,108,4", color: '#003399', position: {x: -200, y: 108} },
    { coords: "135,0,144,4,144,15,135,19,126,15,126,4", color: '#000099', position: {x: -200, y: 126} },
    { coords: "153,0,162,4,162,15,153,19,144,15,144,4", color: '#0000CC', position: {x: -200, y: 144} },
    { coords: "171,0,180,4,180,15,171,19,162,15,162,4", color: '#000066', position: {x: -200, y: 162} },
    { coords: "54,15,63,19,63,30,54,34,45,30,45,19", color: '#006666', position: {x: -185, y: 45} },
    { coords: "72,15,81,19,81,30,72,34,63,30,63,19", color: '#006699', position: {x: -185, y: 63} },
    { coords: "90,15,99,19,99,30,90,34,81,30,81,19", color: '#0099CC', position: {x: -185, y: 81} },
    { coords: "108,15,117,19,117,30,108,34,99,30,99,19", color: '#0066CC', position: {x: -185, y: 99} },
    { coords: "126,15,135,19,135,30,126,34,117,30,117,19", color: '#0033CC', position: {x: -185, y: 117} },
    { coords: "144,15,153,19,153,30,144,34,135,30,135,19", color: '#0000FF', position: {x: -185, y: 135} },
    { coords: "162,15,171,19,171,30,162,34,153,30,153,19", color: '#3333FF', position: {x: -185, y: 153} },
    { coords: "180,15,189,19,189,30,180,34,171,30,171,19", color: '#333399', position: {x: -185, y: 171} },
    { coords: "45,30,54,34,54,45,45,49,36,45,36,34", color: '#669999', position: {x: -170, y: 36} },
    { coords: "63,30,72,34,72,45,63,49,54,45,54,34", color: '#009999', position: {x: -170, y: 54} },
    { coords: "81,30,90,34,90,45,81,49,72,45,72,34", color: '#33CCCC', position: {x: -170, y: 72} },
    { coords: "99,30,108,34,108,45,99,49,90,45,90,34", color: '#00CCFF', position: {x: -170, y: 90} },    
    { coords: "117,30,126,34,126,45,117,49,108,45,108,34", color: '#0099FF', position: {x: -170, y: 108} },
    { coords: "135,30,144,34,144,45,135,49,126,45,126,34", color: '#0066FF', position: {x: -170, y: 126} },
    { coords: "153,30,162,34,162,45,153,49,144,45,144,34", color: '#3366FF', position: {x: -170, y: 144} },
    { coords: "171,30,180,34,180,45,171,49,162,45,162,34", color: '#3333CC', position: {x: -170, y: 162} },
    { coords: "189,30,198,34,198,45,189,49,180,45,180,34", color: '#666699', position: {x: -170, y: 180} },
    { coords: "36,45,45,49,45,60,36,64,27,60,27,49", color: '#339966', position: {x: -155, y: 27} },
    { coords: "54,45,63,49,63,60,54,64,45,60,45,49", color: '#00CC99', position: {x: -155, y: 45} },
    { coords: "72,45,81,49,81,60,72,64,63,60,63,49", color: '#00FFCC', position: {x: -155, y: 63} },
    { coords: "90,45,99,49,99,60,90,64,81,60,81,49", color: '#00FFFF', position: {x: -155, y: 81} },
    { coords: "108,45,117,49,117,60,108,64,99,60,99,49", color: '#33CCFF', position: {x: -155, y: 99} },
    { coords: "126,45,135,49,135,60,126,64,117,60,117,49", color: '#3399FF', position: {x: -155, y: 117} },
    { coords: "144,45,153,49,153,60,144,64,135,60,135,49", color: '#6699FF', position: {x: -155, y: 135} },
    { coords: "162,45,171,49,171,60,162,64,153,60,153,49", color: '#6666FF', position: {x: -155, y: 153} },
    { coords: "180,45,189,49,189,60,180,64,171,60,171,49", color: '#6600FF', position: {x: -155, y: 171} },
    { coords: "198,45,207,49,207,60,198,64,189,60,189,49", color: '#6600CC', position: {x: -155, y: 189} },
    { coords: "27,60,36,64,36,75,27,79,18,75,18,64", color: '#339933', position: {x: -140, y: 18} },
    { coords: "45,60,54,64,54,75,45,79,36,75,36,64", color: '#00CC66', position: {x: -140, y: 36} },
    { coords: "63,60,72,64,72,75,63,79,54,75,54,64", color: '#00FF99', position: {x: -140, y: 54} },
    { coords: "81,60,90,64,90,75,81,79,72,75,72,64", color: '#66FFCC', position: {x: -140, y: 72} },
    { coords: "99,60,108,64,108,75,99,79,90,75,90,64", color: '#66FFFF', position: {x: -140, y: 90} },
    { coords: "117,60,126,64,126,75,117,79,108,75,108,64", color: '#66CCFF', position: {x: -140, y: 108} },
    { coords: "135,60,144,64,144,75,135,79,126,75,126,64", color: '#99CCFF', position: {x: -140, y: 126} },
    { coords: "153,60,162,64,162,75,153,79,144,75,144,64", color: '#9999FF', position: {x: -140, y: 144} },
    { coords: "171,60,180,64,180,75,171,79,162,75,162,64", color: '#9966FF', position: {x: -140, y: 162} },
    { coords: "189,60,198,64,198,75,189,79,180,75,180,64", color: '#9933FF', position: {x: -140, y: 180} },
    { coords: "207,60,216,64,216,75,207,79,198,75,198,64", color: '#9900FF', position: {x: -140, y: 198} },
    { coords: "18,75,27,79,27,90,18,94,9,90,9,79", color: '#006600', position: {x: -125, y: 9} },
    { coords: "36,75,45,79,45,90,36,94,27,90,27,79", color: '#00CC00', position: {x: -125, y: 27} },
    { coords: "54,75,63,79,63,90,54,94,45,90,45,79", color: '#00FF00', position: {x: -125, y: 45} },
    { coords: "72,75,81,79,81,90,72,94,63,90,63,79", color: '#66FF99', position: {x: -125, y: 63} },
    { coords: "90,75,99,79,99,90,90,94,81,90,81,79", color: '#99FFCC', position: {x: -125, y: 81} },
    { coords: "108,75,117,79,117,90,108,94,99,90,99,79", color: '#CCFFFF', position: {x: -125, y: 99} },
    { coords: "126,75,135,79,135,90,126,94,117,90,117,79", color: '#CCCCFF', position: {x: -125, y: 117} },
    { coords: "144,75,153,79,153,90,144,94,135,90,135,79", color: '#CC99FF', position: {x: -125, y: 111357} },
    { coords: "162,75,171,79,171,90,162,94,153,90,153,79", color: '#CC66FF', position: {x: -125, y: 153} },
    { coords: "180,75,189,79,189,90,180,94,171,90,171,79", color: '#CC33FF', position: {x: -125, y: 171} },
    { coords: "198,75,207,79,207,90,198,94,189,90,189,79", color: '#CC00FF', position: {x: -125, y: 189} },
    { coords: "216,75,225,79,225,90,216,94,207,90,207,79", color: '#9900CC', position: {x: -125, y: 207} },
    { coords: "9,90,18,94,18,105,9,109,0,105,0,94", color: '#003300', position: {x: -110, y: 0} },
    { coords: "27,90,36,94,36,105,27,109,18,105,18,94", color: '#009933', position: {x: -110, y: 18} },
    { coords: "45,90,54,94,54,105,45,109,36,105,36,94", color: '#33CC33', position: {x: -110, y: 36} },
    { coords: "63,90,72,94,72,105,63,109,54,105,54,94", color: '#66FF66', position: {x: -110, y: 54} },
    { coords: "81,90,90,94,90,105,81,109,72,105,72,94", color: '#99FF99', position: {x: -110, y: 72} },
    { coords: "99,90,108,94,108,105,99,109,90,105,90,94", color: '#CCFFCC', position: {x: -110, y: 90} },
    { coords: "117,90,126,94,126,105,117,109,108,105,108,94", color: '#FFFFFF', position: {x: -110, y: 108} },
    { coords: "135,90,144,94,144,105,135,109,126,105,126,94", color: '#FFCCFF', position: {x: -110, y: 126} },
    { coords: "153,90,162,94,162,105,153,109,144,105,144,94", color: '#FF99FF', position: {x: -110, y: 144} },
    { coords: "171,90,180,94,180,105,171,109,162,105,162,94", color: '#FF66FF', position: {x: -110, y: 162} },
    { coords: "189,90,198,94,198,105,189,109,180,105,180,94", color: '#FF00FF', position: {x: -110, y: 180} },
    { coords: "207,90,216,94,216,105,207,109,198,105,198,94", color: '#CC00CC', position: {x: -110, y: 198} },
    { coords: "225,90,234,94,234,105,225,109,216,105,216,94", color: '#660066', position: {x: -110, y: 216} },
    { coords: "18,105,27,109,27,120,18,124,9,120,9,109", color: '#336600', position: {x: -95, y: 9} },
    { coords: "36,105,45,109,45,120,36,124,27,120,27,109", color: '#009900', position: {x: -95, y: 27} },
    { coords: "54,105,63,109,63,120,54,124,45,120,45,109", color: '#66FF33', position: {x: -95, y: 45} },
    { coords: "72,105,81,109,81,120,72,124,63,120,63,109", color: '#99FF66', position: {x: -95, y: 63} },
    { coords: "90,105,99,109,99,120,90,124,81,120,81,109", color: '#CCFF99', position: {x: -95, y: 81} },
    { coords: "108,105,117,109,117,120,108,124,99,120,99,109", color: '#FFFFCC', position: {x: -95, y: 99} },
    { coords: "126,105,135,109,135,120,126,124,117,120,117,109", color: '#FFCCCC', position: {x: -95, y: 117} },
    { coords: "144,105,153,109,153,120,144,124,135,120,135,109", color: '#FF99CC', position: {x: -95, y: 135} },
    { coords: "162,105,171,109,171,120,162,124,153,120,153,109", color: '#FF66CC', position: {x: -95, y: 153} },
    { coords: "180,105,189,109,189,120,180,124,171,120,171,109", color: '#FF33CC', position: {x: -95, y: 171} },
    { coords: "198,105,207,109,207,120,198,124,189,120,189,109", color: '#CC0099', position: {x: -95, y: 189} },
    { coords: "216,105,225,109,225,120,216,124,207,120,207,109", color: '#993399', position: {x: -95, y: 207} },
    { coords: "27,120,36,124,36,135,27,139,18,135,18,124", color: '#333300', position: {x: -80, y: 18} },
    { coords: "45,120,54,124,54,135,45,139,36,135,36,124", color: '#669900', position: {x: -80, y: 36} },
    { coords: "63,120,72,124,72,135,63,139,54,135,54,124", color: '#99FF33', position: {x: -80, y: 54} },
    { coords: "81,120,90,124,90,135,81,139,72,135,72,124", color: '#CCFF66', position: {x: -80, y: 72} },
    { coords: "99,120,108,124,108,135,99,139,90,135,90,124", color: '#FFFF99', position: {x: -80, y: 90} },
    { coords: "117,120,126,124,126,135,117,139,108,135,108,124", color: '#FFCC99', position: {x: -80, y: 108} },
    { coords: "135,120,144,124,144,135,135,139,126,135,126,124", color: '#FF9999', position: {x: -80, y: 126} },
    { coords: "153,120,162,124,162,135,153,139,144,135,144,124", color: '#FF6699', position: {x: -80, y: 144} },
    { coords: "171,120,180,124,180,135,171,139,162,135,162,124", color: '#FF3399', position: {x: -80, y: 162} },
    { coords: "189,120,198,124,198,135,189,139,180,135,180,124", color: '#CC3399', position: {x: -80, y: 180} },
    { coords: "207,120,216,124,216,135,207,139,198,135,198,124", color: '#990099', position: {x: -80, y: 198} },
    { coords: "36,135,45,139,45,150,36,154,27,150,27,139", color: '#666633', position: {x: -65, y: 27} },
    { coords: "54,135,63,139,63,150,54,154,45,150,45,139", color: '#99CC00', position: {x: -65, y: 45} },
    { coords: "72,135,81,139,81,150,72,154,63,150,63,139", color: '#CCFF33', position: {x: -65, y: 63} },
    { coords: "90,135,99,139,99,150,90,154,81,150,81,139", color: '#FFFF66', position: {x: -65, y: 81} },
    { coords: "108,135,117,139,117,150,108,154,99,150,99,139", color: '#FFCC66', position: {x: -65, y: 99} },
    { coords: "126,135,135,139,135,150,126,154,117,150,117,139", color: '#FF9966', position: {x: -65, y: 117} },
    { coords: "144,135,153,139,153,150,144,154,135,150,135,139", color: '#FF6666', position: {x: -65, y: 135} },
    { coords: "162,135,171,139,171,150,162,154,153,150,153,139", color: '#FF0066', position: {x: -65, y: 153} },
    { coords: "180,135,189,139,189,150,180,154,171,150,171,139", color: '#CC6699', position: {x: -65, y: 171} },
    { coords: "198,135,207,139,207,150,198,154,189,150,189,139", color: '#993366', position: {x: -65, y: 189} },
    { coords: "45,150,54,154,54,165,45,169,36,165,36,154", color: '#999966', position: {x: -50, y: 36} },
    { coords: "63,150,72,154,72,165,63,169,54,165,54,154", color: '#CCCC00', position: {x: -50, y: 54} },
    { coords: "81,150,90,154,90,165,81,169,72,165,72,154", color: '#FFFF00', position: {x: -50, y: 72} },
    { coords: "99,150,108,154,108,165,99,169,90,165,90,154", color: '#FFCC00', position: {x: -50, y: 90} },
    { coords: "117,150,126,154,126,165,117,169,108,165,108,154", color: '#FF9933', position: {x: -50, y: 108} },
    { coords: "135,150,144,154,144,165,135,169,126,165,126,154", color: '#FF6600', position: {x: -50, y: 126} },
    { coords: "153,150,162,154,162,165,153,169,144,165,144,154", color: '#FF5050', position: {x: -50, y: 144} },
    { coords: "171,150,180,154,180,165,171,169,162,165,162,154", color: '#CC0066', position: {x: -50, y: 162} },
    { coords: "189,150,198,154,198,165,189,169,180,165,180,154", color: '#660033', position: {x: -50, y: 180} },
    { coords: "54,165,63,169,63,180,54,184,45,180,45,169", color: '#996633', position: {x: -35, y: 45} },
    { coords: "72,165,81,169,81,180,72,184,63,180,63,169", color: '#CC9900', position: {x: -35, y: 63} },
    { coords: "90,165,99,169,99,180,90,184,81,180,81,169", color: '#FF9900', position: {x: -35, y: 81} },
    { coords: "108,165,117,169,117,180,108,184,99,180,99,169", color: '#CC6600', position: {x: -35, y: 99} },
    { coords: "126,165,135,169,135,180,126,184,117,180,117,169", color: '#FF3300', position: {x: -35, y: 117} },
    { coords: "144,165,153,169,153,180,144,184,135,180,135,169", color: '#FF0000', position: {x: -35, y: 135} },
    { coords: "162,165,171,169,171,180,162,184,153,180,153,169", color: '#CC0000', position: {x: -35, y: 153} },
    { coords: "180,165,189,169,189,180,180,184,171,180,171,169", color: '#990033', position: {x: -35, y: 171} },
    { coords: "63,180,72,184,72,195,63,199,54,195,54,184", color: '#663300', position: {x: -20, y: 54} },
    { coords: "81,180,90,184,90,195,81,199,72,195,72,184", color: '#996600', position: {x: -20, y: 72} },
    { coords: "99,180,108,184,108,195,99,199,90,195,90,184", color: '#CC3300', position: {x: -20, y: 90} },
    { coords: "117,180,126,184,126,195,117,199,108,195,108,184", color: '#993300', position: {x: -20, y: 108} },
    { coords: "135,180,144,184,144,195,135,199,126,195,126,184", color: '#990000', position: {x: -20, y: 126} },
    { coords: "153,180,162,184,162,195,153,199,144,195,144,184", color: '#800000', position: {x: -20, y: 144} },
    { coords: "171,180,180,184,180,195,171,199,162,195,162,184", color: '#993333', position: {x: -20, y: 162} }
  ];

  function handlePrimaryChangeColor(color: string, top: number, left: number) {
    setTop(top);
    setLeft(left);
    dispatch({
      type: TodoActions.settingsUpdated,
      payload: {
        ...todoList.settings,
        theme: {
          ...todoList.settings.theme,
          primaryColor: color,
          primaryColorTopCord: top,
          primaryColorLefCord: left
        } as IThemeSettings
      }
    } as IAction);
  }

  return (
    <div className='App__settings__group'>
      <label className='App__settings__group-label'>Theme</label>
      <div className='App__settings__group__item'>
        <label>Background color:</label>
        <Stack direction="horizontal" gap={5} className="mt-2 justify-content-center flex-wrap">
          <Stack direction="horizontal" gap={3}>
            <div 
              id="dark-theme-gray"
              data-testid="dark-theme-gray-button"
              className="App__settings__theme__background-color-item"
              onClick={() => {
                dispatch({
                  type: TodoActions.settingsUpdated,
                  payload: {
                    ...todoList.settings,
                    theme: {
                      ...todoList.settings.theme,
                      backgroundColor: BackgroundColor.DarkGray,
                      bsTheme: BsThemes.Dark
                    } as IThemeSettings
                  }
                } as IAction);
              }}
            ></div>
            <div 
              id="dark-theme-blue"
              data-testid="dark-theme-blue-button"
              className="App__settings__theme__background-color-item"
              onClick={() => {
                dispatch({
                  type: TodoActions.settingsUpdated,
                  payload: {
                    ...todoList.settings,
                    theme: {
                      ...todoList.settings.theme,
                      backgroundColor: BackgroundColor.DarkBlue,
                      bsTheme: BsThemes.Dark
                    } as IThemeSettings
                  }
                } as IAction);
              }}
            ></div>          
            <div 
              id="dark-theme-red"
              data-testid="dark-theme-red-button"
              className="App__settings__theme__background-color-item"
              onClick={() => {
                dispatch({
                  type: TodoActions.settingsUpdated,
                  payload: {
                    ...todoList.settings,
                    theme: {
                      ...todoList.settings.theme,
                      backgroundColor: BackgroundColor.DarkRed,
                      bsTheme: BsThemes.Dark
                    } as IThemeSettings
                  }
                } as IAction);
              }}
            ></div>
          </Stack>
          <Stack direction="horizontal" gap={3}>
            <div 
              id="light-theme-gray"
              data-testid="light-theme-gray-button"
              className="App__settings__theme__background-color-item"
              onClick={() => {
                dispatch({
                  type: TodoActions.settingsUpdated,
                  payload: {
                    ...todoList.settings,
                    theme: {
                      ...todoList.settings.theme,
                      backgroundColor: BackgroundColor.LightGray,
                      bsTheme: BsThemes.Light
                    } as IThemeSettings
                  } 
                } as IAction);
              }}
            ></div>
            <div 
              id="light-theme-blue"
              data-testid="light-theme-blue-button"
              className="App__settings__theme__background-color-item"
              onClick={() => {
                dispatch({
                  type: TodoActions.settingsUpdated,
                  payload: {
                    ...todoList.settings,
                    theme: {
                      ...todoList.settings.theme,
                      backgroundColor: BackgroundColor.LightBlue,
                      bsTheme: BsThemes.Light
                    } as IThemeSettings
                  }
                } as IAction);
              }}
            ></div>          
            <div 
              id="light-theme-red"
              data-testid="light-theme-red-button" 
              className="App__settings__theme__background-color-item"
              onClick={() => {
                dispatch({
                  type: TodoActions.settingsUpdated,
                  payload: {
                    ...todoList.settings,
                    theme: {
                      ...todoList.settings.theme,
                      backgroundColor: BackgroundColor.LightRed,
                      bsTheme: BsThemes.Light
                    } as IThemeSettings
                  }
                } as IAction);
              }}
            ></div>
          </Stack>
        </Stack>        
      </div>
      <div className='App__settings__group__item'>
        <label>Primary color:</label>
        <div className="d-flex justify-content-center mt-3">
          <div style={{margin:"auto", width:"236px"}}>
            <img style={{marginRight:"2px"}} src="img_colormap.gif" useMap="#colormap" alt="colormap" />
            <map id="colormap" name="colormap">
              {areas.map((area, index) => <area key={index} data-testid={"primary-color-" + area.color + "-button"}  style={{cursor:"pointer"}} shape="poly" coords={area.coords} onClick={() => handlePrimaryChangeColor(area.color, area.position.x, area.position.y)} alt={area.color} />)}
            </map>
            <div id="selectedhexagon" style={
              {
                visibility: "visible", 
                position: "relative",
                width: "21px",
                height: "21px",
                backgroundImage: "url('img_selectedcolor.gif')",
                top: top + "px",
                left: left + "px",
              }
            }>              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}