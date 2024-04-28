<?php
    $Pinturillon="localhost";
    $Admin="root";
    $Password="";
    $DBName="Pinturillon";
    $CONN=new mysqli($Pinturillon,$Admin,$Password,$DBName);
    if($CONN->connect_error){
        die("Error connecting to Pinturillon: " . $CONN->connect_error);
    }
    echo"Successfully connected to Pinturillon";
?>