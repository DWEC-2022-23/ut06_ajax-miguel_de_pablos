<?php

$guests = json_decode(file_get_contents("../novios.json"), true);

switch ($_POST["action"]) {
    case "add":
        $guest = [
            "nombre" => $_POST["name"],
            "confirmed" => $_POST["confirmed"]
        ];
        $guests[] = $guest;
        break;
    case "edit":
        $index = $_POST["index"];
        $guests[$index]["nombre"] = $_POST["name"];
        $guests[$index]["confirmed"] = $_POST["confirmed"];
        break;
    case "remove":
        $index = $_POST["index"];
        array_splice($guests, $index, 1);
        break;
}

file_put_contents("../novios.json", json_encode($guests, JSON_PRETTY_PRINT));

echo json_encode(["success" => true]);
