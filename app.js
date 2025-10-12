const c=document.getElementById('bg'),x=c.getContext('2d');
function resize(){c.width=innerWidth;c.height=innerHeight;}
addEventListener('resize',resize);resize();
function draw(){
  x.fillStyle='rgba(14,19,32,0.15)';
  x.fillRect(0,0,c.width,c.height);
  for(let i=0;i<80;i++){
    const cx=Math.random()*c.width,cy=Math.random()*c.height,r=Math.random()*2;
    x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);
    x.fillStyle=hsla(,100%,50%,.2);x.fill();
  }
  requestAnimationFrame(draw);
}
draw();
