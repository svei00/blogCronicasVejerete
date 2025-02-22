import { Button } from "flowbite-react";
import Image from "next/image";

export default function callToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-orange-400 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center items-center flex flex-col">
        <h2 className="text-2xl>">¿Quieres aprender Microsoft Excel?</h2>
        <p className="text-gray-500 my-2">
          ¡No pierdas más tiempo! Aprende a manejar Excel de manera eficiente y
          profesional.
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://www.ExcelSolutionsV.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog Excel SolutionsV
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/4/40/Microsoft-excel.png"
          alt="Excel Logo"
          width={800} // Set the width in pixels
          height={600} // Set the height in pixels
        />
      </div>
    </div>
  );
}
