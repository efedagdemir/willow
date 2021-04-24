
var infoPageHTML = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/info_page.css")}">
    <style>
    
        /* width */
        ::-webkit-scrollbar {
            width: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.0);
            border-radius: 20px;
            
        }
       
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #888; 
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 40px;
        }
    </style>
</head>

<body>
    <div id="infoPage"> 
        
        <div id="willowInfoHeader">
            
            <button type="button" id="info_close_btn"></button>
            <p id="firstP"> 
                <b>Willow: Graph-Based Browsing </b>
            </p>

        </div>
        <div id="willowInfoBody">
            
            <p id="secondP">  
                Bilkent CS Senior Design Project <br> <br>
                <b> Contact: </b> <br>
                bilkent-cs-senior-willow@googlegroups.com <br> <br>
                <b> Supervisor: </b> Uğur Doğrusöz  <br>
                <b> Github: </b> <a href="https://github.com/efedagdemir/willow">Willow!</a> <br>      
            </p>
        
            <footer id="willow_footer">
                Version 1.0 - 2021
            </footer>

        </div>    
    </div>
</body>
</html>
`;
   

function openInfoPage() {
   
    infoWrapper = document.createElement('div');
    infoWrapper.id = "willowInfoPageWrapper";
    infoWrapper.innerHTML = infoPageHTML;
    
    document.getElementById("panelBody").appendChild(infoWrapper);
    document.getElementById("info_close_btn").onclick = () => closeInfoPage(); 
}


function closeInfoPage() {
    infoWrapper.parentNode.removeChild(infoWrapper);
}

