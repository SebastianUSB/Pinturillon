<?php
    $Pinturillon="localhost";
    $Admin="root";
    $Password="";
    $DBName="Pinturillon";
    $conn=new mysqli($Pinturillon,$Admin,$Password,$DBName);
    if($conn->connect_error){
        die("Error connecting to Pinturillon: " . $conn->connect_error);
    }
    //echo "Successfully connected to Pinturillon";
?>