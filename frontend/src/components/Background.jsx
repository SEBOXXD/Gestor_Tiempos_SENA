// Se importa useEffect y useRef. useRef permite guardar los valores del compenente durante toda la visita de la pagina, sin tener que re-renderizar el componente entero. Y useEffect, el cual permite ejecutar el codigo que se le pase como parametro cada vez que el componente se renderice
import { useEffect, useRef } from "react";

//Se crea la funcion del fondo, y se crea la conexion con el canvas
function Background() {
  const canvasRef = useRef(null);

  //Lo que se ejecuta cuando el componente se renderice
  useEffect(() => {

    //Se toma el canvas actual, y se llama la herramienta para dibujar
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //Particulas en movimiento
    let particles = [];

    //Parametros para ocupar todo el canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Logica para las particulas, posicion, tamaño, velocidad y cantidad
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    //funcion para borrar el contenido anterior, y dar posicion al contenido nuevo (particulas)
    function animate() {

        // Parte de la funcion la cual borra el contenido para volverlo a dibujar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Movimiento
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        //Dirige las particulas a otra parte una vez toquen el borde del canvas
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        //dibuja y pinta las particulas arc= dibuja, fill = pinta, Math.PI * 2 = circulo completo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(167, 215, 215, 0.7)";
        ctx.fill();
      });

      //Recall a la funcion
      requestAnimationFrame(animate);
    }

    //Inicia el codigo
    animate();
  }, []);

  //Render
  return <canvas ref={canvasRef} className="bg-canvas"></canvas>;
}

export default Background;