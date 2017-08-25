<?php

//för cors
//header("Access-Control-Allow-Origin: *");
//för Auth
//header("Access-Control-Allow-Headers: Authorization");
//för json
//recieve if its GET,POST,PUT...
$verb = $_SERVER['REQUEST_METHOD'];

//max höjd eller bred
$MAX_WIDTH_HEIGHT = 500;
//mapp
$target_dir = "/uploads/";

if ($verb == "POST") {

    header('Content-Type: application/json');
    //   ini_set("file_uploads", "On");
    ini_set("file_uploads", "On");

    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

    $uploadOk = 1;
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    $uniqueFilename = createUniqueFilename($imageFileType);

// Check if image file is a actual image or fake image
    if (isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if ($check !== false) {
            
        } else {
            $uploadOk = 0;
        }
    }

// Allow certain file formats
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        $uploadOk = 0;
    }

// Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        $arr = array();
        header('HTTP/1.0 400 Bad Request');
        echo json_encode($arr);
    } else {

        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], getcwd() . $target_dir . $uniqueFilename)) {
            //resize
            list($width, $height) = getimagesize($target_dir . $uniqueFilename);
            if ($width > $MAX_WIDTH_HEIGHT || $height > $MAX_WIDTH_HEIGHT) {
                resize_image($target_dir . $uniqueFilename, $MAX_WIDTH_HEIGHT, $MAX_WIDTH_HEIGHT, $imageFileType);
            }

            $arr = array('filename' => $uniqueFilename);
            header('HTTP/1.0 202 Accepted');
            echo json_encode($arr);
        } else {
            $arr = array();
            header('HTTP/1.0 400 Bad Request');
            echo json_encode($arr);
        }
    }
} else if ($verb == "GET") {
    
    if (isset($_GET['size'])) {
        $size = filter_input(INPUT_GET, 'size', FILTER_SANITIZE_ENCODED);
        
    }else { $size = 200;}
    
    if (isset($_GET['file'])) {
        $file = $target_dir . filter_input(INPUT_GET, 'file', FILTER_SANITIZE_ENCODED);
        
       $image = resize_image($file, $size, $size, pathinfo($file, PATHINFO_EXTENSION), true);
       showImage($image, pathinfo($file, PATHINFO_EXTENSION));  
       
    }
    
    echo pathinfo($file, PATHINFO_EXTENSION);

} else {
    //Skicka 405
    header('HTTP/1.0 405 Method Not Allowed');
}

function createUniqueFilename($file_end) {
    $n = uniqid();
    $n = $n . "." . $file_end;
    $dir = 'uploads';
    $files = scandir($dir);
    foreach ($files as $value) {
        if ($n == $value) {
            createUniqueFilename($file_end);
        }
    }
    return $n;
}

function resize_image($file, $w, $h, $type, $return = FALSE, $crop = FALSE) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width - ($width * abs($r - $w / $h)));
        } else {
            $height = ceil($height - ($height * abs($r - $w / $h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w / $h > $r) {
            $newwidth = $h * $r;
            $newheight = $h;
        } else {
            $newheight = $w / $r;
            $newwidth = $w;
        }
    }

    if ($type == "png") {
        $src = imagecreatefrompng($file);
        $dst = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        if ($return) {
            return $dst;
        }
        imagepng($dst, $file);
    } else if ($type == "jpg") {
        $src = imagecreatefromjpeg($file);
        $dst = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        if ($return) {
            return $dst;
        }
        imagejpeg($dst, $file);
    } else if ($type == "gif") {
        $src = imagecreatefromgif($file);
        $dst = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        if ($return) {
            return $dst;
        }
        imagegif($dst, $file);
    }
}

function showImage($image, $type){
    switch ($type) {
        case "gif": $ctype = "image/gif";
            header("Content-type: image/gif");
            imagegif($image);
            imagedestroy($image);
            break;
        case "png": $ctype = "image/png";
            header("Content-type: image/png");
            imagepng($image);
            imagedestroy($image);
            break;
        case "jpeg":
        case "jpg": $ctype = "image/jpeg";
             header("Content-type: image/jpeg");
            imagejpeg($image);
            imagedestroy($image);
            break;
        default:
    }  
}
?>