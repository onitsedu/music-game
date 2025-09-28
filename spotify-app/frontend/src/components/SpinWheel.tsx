import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

export type WheelItem = {
  id: string | number;
  name: string;
  color: string;
};

type SpinWheelProps = {
  pointerColor?: string;
  items: WheelItem[];
  onResult: (item: WheelItem) => void;
  onClick?: () => void;
  size?: number; // diámetro de la ruleta
};

export type SpinWheelRef = {
  spin: () => void;
};

const SpinWheel = forwardRef<SpinWheelRef, SpinWheelProps>(
  ({ items, onResult, size = 300, pointerColor = 'red', onClick }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [targetRotation, setTargetRotation] = useState(0);

    // Dibuja la ruleta
    useEffect(() => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const ctx = canvasEl.getContext("2d");
      if (!ctx) return;

      const radius = size / 2;
      const anglePerSlice = (2 * Math.PI) / items.length;

      ctx.clearRect(0, 0, size, size);

      // trasladamos el sistema de coordenadas al centro
      // dibujar ruleta centrada
      ctx.save();
      ctx.translate(radius, radius);

      items.forEach((item, index) => {
        const startAngle = index * anglePerSlice + rotation;
        const endAngle = startAngle + anglePerSlice;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        // texto
        ctx.save();
        ctx.rotate(startAngle + anglePerSlice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.fillText(item.name, radius - 10, 5);
        ctx.restore();
      });

      ctx.restore();

      ctx.fillStyle = pointerColor;
      ctx.beginPath();
      ctx.moveTo(radius - 20, -20); // base izq fuera
      ctx.lineTo(radius + 20, -20); // base der fuera
      ctx.lineTo(radius, 20);       // punta dentro
      ctx.closePath();
      ctx.fill();

    }, [items, rotation, size]);

    // Función de girar expuesta al padre
    const spin = () => {
      if (isSpinning || items.length === 0) return;

      setIsSpinning(true);

      const randomRotation =
        360 * (3 + Math.random() * 3) + Math.random() * 360;

      setTargetRotation(rotation + (randomRotation * Math.PI) / 180);
    };

    useImperativeHandle(ref, () => ({
      spin,
    }));

    // Animación
    useEffect(() => {
      if (!isSpinning) return;

      let start: number | null = null;
      const duration = 4000;
      const startRotation = rotation;

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentRotation =
          startRotation + (targetRotation - startRotation) * easeOut;

        setRotation(currentRotation);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsSpinning(false);

          // Ganador
          const normalizedRotation =
            ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          const anglePerSlice = (2 * Math.PI) / items.length;

          const pointerAngle = -Math.PI / 2; // puntero arriba (12:00)
          let pointerRelative = (pointerAngle - currentRotation) % (2 * Math.PI);
          if (pointerRelative < 0) pointerRelative += 2 * Math.PI;

          const winningIndex =
            Math.floor(pointerRelative / anglePerSlice) % items.length;

          const winner = items[winningIndex];
          console.log(winningIndex)
          console.log(winner)
          if (winner) onResult(winner);
        }
      };

      requestAnimationFrame(animate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSpinning]);

    return <canvas onClick={onClick} ref={canvasRef} width={size} height={size} />;
  }
);

export default SpinWheel;
