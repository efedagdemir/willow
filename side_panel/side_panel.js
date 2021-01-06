/* Set the width of the sidebar to 250px (show it) */
function openNav() {
document.getElementById("mySidepanel").style.width = "400px";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
document.getElementById("mySidepanel").style.width = "0px";
} 

document.getElementById("openbtnInst").onclick = openNav;
document.getElementById("closebtnInst").onclick = closeNav;