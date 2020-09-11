<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Library\QueryBuilder as QB;
use App\Library\Utilities as Ut;
use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;

use DateInterval;
use DateTime;
use DatePeriod;
use Cassandra;
use  CURLFile;

class networkAnalysisController extends Controller
{
 
    public function generateNetwork(){

    }

    public function graph_view_data_formator_for_rendering_in_visjs(Request $request)
    {
        $network_arr = json_decode($this->read_csv_file($request));
        if (isset($_GET['limit'])) {
            $limit = $_GET['limit'];
            $network_arr = array_slice($network_arr, 0, intval($limit));
        }
        $final_result = array("nodes" => array(), "edges" => array());
        $unique_node_temp_arr = array();
        $final_node_arr = array();
        $edges_temp_arr = array();
      //  $GraphData_obj = new GraphData;
        if (isset($_GET['option'])) {
            $option = $_GET['option'];
            if ($option == 'user') {
                // unique node generation
                $network_arr = array_slice($network_arr, 1, sizeof($network_arr));
                foreach ($network_arr as $connection) {
                    for ($i = 0; $i < sizeof($connection) - 1; $i++) {
                        if (!(in_array($connection[$i], $unique_node_temp_arr))) {
                            array_push($unique_node_temp_arr, $connection[$i]);
                            if ($i == 0){
                                array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i]));
                            }
                                //Commented for user ID mapping
                                //else{
                               // $output = $GraphData_obj->id_user_mapping($connection[$i]); // get user_name of user_id
                               // $author_name = null;
                               // foreach ($output as $op) {
                                 //   $author_name = '@'.$op["author_screen_name"];
                                   // if ($author_name) {
                                     //   array_push($final_node_arr, array("id" => $connection[$i], "label" =>  $author_name));
                                    //}
                                   // else {
                                     //   array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i]));
                                   // }
                              //  }
                            }
                        }
                    }
                }
        } else {
            // unique node generation
            $network_arr = array_slice($network_arr, 1, sizeof($network_arr));
            foreach ($network_arr as $connection) {
                for ($i = 0; $i < sizeof($connection) - 1; $i++) {
                    if (!(in_array($connection[$i], $unique_node_temp_arr))) {
                        array_push($unique_node_temp_arr, $connection[$i]);
                        if(substr($connection[$i],0,1) == "#"){
                         //array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'dot', "icon" => '{ face: "FontAwesome", code: "\uf198", size: 150, color: "#57169a"}', "group" => 'castle' ));
                           array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'public/icons/hashtag.svg', "size" => 50, "borderwidth" => 5, "border" => "#EA9999" ));
                        }else if(substr($connection[$i],0,1) == "@"){
                            //$GraphData_obj->handle_user_mapping($connection[$i]);
                            array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'public/icons/roshanmention.jpg', "size" => 50, "borderwidth" => 5, "border" => "#EA9999" ));
                        }else if(substr($connection[$i],0,1) == "*"){
                            //$GraphData_obj->handle_user_mapping($connection[$i]);
                            $trimmed_string = ltrim($connection[$i], $connection[$i][0]);
                            array_push($final_node_arr, array("id" => $connection[$i], "label" => $trimmed_string , "shape" => 'circularImage', "image" => 'public/icons/keyword.svg', "size" => 50, "borderwidth" => 5, "border" => "#EA9999" ));
                        }else if(substr($connection[$i],0,1) == "$"){
                           // $output = $GraphData_obj->id_user_mapping($connection[$i]);
                            foreach($output as $op){
                            $user_name = $op["author_screen_name"];
                            $profile_image_link = $op["profile_image_url_https"];
                            }
                            array_push($final_node_arr, array("id" => $connection[$i], "label" =>  $user_name, "shape" => 'circularImage', "image" => $profile_image_link, "size" => 50, "borderwidth" => 7, "border" => "#EA9999" ));
                        }
                        else{
                        if((sizeof($connection) - 1) > 2){
                            if($i == 1){
                                if($connection[3]!=null){
                                    array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => $connection[3], "size" => 50, "borderwidth" => 7, "border" => "#EA9999" ));
                                }else{
                                    array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'public/icons/keyword.svg', "size" => 50, "borderwidth" => 7, "border" => "#EA9999" ));
                                }
                            }else{
                                    array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'app/Http/Controllers/graph/roshanuser.svg', "size" => 50, "borderwidth" => 7, "border" => "#EA9999" ));
                            }
                        }
                       
                        }
                        
                       // array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i]));
                    }
                }
            }
        }

        // unique edges generation
        foreach ($network_arr as $hash_list) {
            $flag = true;
            foreach ($edges_temp_arr as $one) {
                if (($one["from"] == $hash_list[0] && $one["to"] == $hash_list[1]) || ($one["to"] == $hash_list[0] && $one["from"] == $hash_list[1])) {
                    $flag = false;
                    break;
                }
            }
            if ($flag == true) {
                array_push($edges_temp_arr, array("from" => $hash_list[0], "to" => $hash_list[1], "label" => $hash_list[2]));
            }
        }
        $final_result["nodes"] = $final_node_arr;
        $final_result["edges"] = $edges_temp_arr;
        return json_encode($final_result);
    }

    public function isfileexist(Request $request,$filename){
        $dir_name = "netdir";
        $filename = $_GET['input'];
        file_exists("storage/$dir_name/$filename.csv");
    }
    
    public function fileupload(Request $request)
    {
        $x = $_POST["name"];
       // $dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";

        $validation = Validator::make($request->all(), [
            'select_file' => 'required|max:1520480'
        ]);
        if ($validation->passes()) {
            $image = $request->file('select_file');
            $new_name = $x . '.' . $image->getClientOriginalExtension();
            // $path = "/var/www/html/front-end/storage/$dir_name";
            $path = "storage/$dir_name";

            $image->move($path, $new_name);
            // $image->move(public_path('storage'), $new_name);
            return response()->json([
                'message' => 'Edgelist Uploaded Successfully',
                'class_name' => 'alert-success'
            ]);
        } else {
            return response()->json([
                'message' => $validation->errors()->all(),
                'uploaded_image' => '',
                'class_name' => 'alert-danger'
            ]);
        }
    }


    public function read_csv_file(Request $request, $filename = null, $option = null)
    {
        //$dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        $input = $_GET['input'];
        if ($filename) {
            if ($option == 'union')
                $input = $filename . $option;
            if ($option == 'intersection')
                $input = $filename . $option;
            if ($option == 'difference')
                $input = $filename . $option;
            if ($option == null)
                $input = $filename;
        } else {
            if ($option == 'centralities')
                $input = $input . "centralities";
            if ($option == 'shortestpath')
                $input = $input . "shortestpath";
            if ($option == 'linkprediction')
                $input = $input . "linkprediction";
        }

        $csvFile = file("storage/$dir_name/$input.csv");
        $final_arr = [];
        foreach ($csvFile as $line) {
            $final_arr[] = str_getcsv($line);
        }
        return json_encode($final_arr);
    }

    public function centrality_data_formator_for_rendering_in_visjs(Request $request)
    {
        $network_arr = json_decode($this->read_csv_file($request));
        $network_centrality_arr = json_decode($this->read_csv_file($request, null, "centralities"));
        $final_result = array("nodes" => array(), "edges" => array());
        $unique_node_temp_arr = array();
        $final_node_arr = array();
        $edges_temp_arr = array();
        
    //    $GraphData_obj = new GraphData;

        // unique edges generation
        foreach ($network_centrality_arr as $one_list) {
             if(substr($one_list[0],0,1) == "$"){
                         //   $output = $GraphData_obj->id_user_mapping($one_list[0]);
                         //   foreach($output as $op){
                         //   $user_name = $op["author_screen_name"];
                          //  $profile_image_link = $op["profile_image_url_https"];
                           // }
                          //  array_push($final_node_arr, array("id" => $one_list[0], "label" =>  $user_name, "shape" => 'circularImage', "image" => $profile_image_link, "size" => (220 * $one_list[1]), "borderwidth" => 7, "border" => "#EA9999" ));
                }else if(substr($one_list[0],0,1) == "#"){
                             array_push($final_node_arr, array("id" => $one_list[0], "label" => $one_list[0], "shape" => 'circularImage', "image" => 'public/icons/hashtag.svg' , "size" => (220 * $one_list[1]), "borderwidth" => 7, "border" => "#EA9999" ));
                }else if(substr($one_list[0],0,1) == "@"){
                             array_push($final_node_arr, array("id" => $one_list[0], "label" => $one_list[0], "shape" => 'circularImage', "image" => 'public/icons/roshanmention.jpg' , "size" => (220 * $one_list[1]), "borderwidth" => 7, "border" => "#EA9999" ));
                }else if(substr($one_list[0],0,1) == "*"){
                             array_push($final_node_arr, array("id" => $one_list[0], "label" => $one_list[0], "shape" => 'circularImage', "image" => 'public/icons/keyword.svg' , "size" => (220 * $one_list[1]), "borderwidth" => 7, "border" => "#EA9999" ));
                }
            
            //array_push($final_node_arr, array("id" => $one_list[0], "label" => $one_list[0], "size" => (220 * $one_list[1])));
        }
        // unique edges generation
        $network_arr = array_slice($network_arr, 1, sizeof($network_arr));
        foreach ($network_arr as $hash_list) {
            $flag = true;
            foreach ($edges_temp_arr as $one) {
                if (($one["from"] == $hash_list[0] && $one["to"] == $hash_list[1]) || ($one["to"] == $hash_list[0] && $one["from"] == $hash_list[1])) {
                    $flag = false;
                    break;
                }
            }
            if ($flag == true) {
                array_push($edges_temp_arr, array("from" => $hash_list[0], "to" => $hash_list[1], "label" => $hash_list[2]));
            }
        }
        $final_result["nodes"] = $final_node_arr;
        $final_result["edges"] = $edges_temp_arr;
        return json_encode($final_result);
    }



    public function centrality(Request $request)
    {
        $input = $request->input('input');
        // $input = $_GET['input'];
       // $dir_name = strval($this->get_session_uid($request));
       // $read_path = "storage/$dir_name/$input.csv";
        $dir_name = "netdir";
        $read_path = "storage/netdir/$input.csv";
        $algo_option = $request->input('algo_option');

        switch ($algo_option) {
            case 'degcen':
                $algo_choosen_option = '71';
                break;
            case 'pgcen':
                $algo_choosen_option = '74';
                break;
            case 'btwncen':
                $algo_choosen_option = '72';
                break;
            case 'evcen':
                $algo_choosen_option = '73';
                break;
            default:
                # code...
                break;
        }
        $command = escapeshellcmd('/usr/bin/python python_files/generation.py ' . $algo_choosen_option . ' ' . $read_path . ' ' . $input . ' ' . $dir_name);
        $output = shell_exec($command);
        echo json_encode($output);
    }

    public function get_session_uid($request)
    {
        return $request->session()->get('uid');
    }

    public function mysessionid(Request $request){
        $dir_name = strval($this->get_session_uid($request));
        echo $dir_name;
    }

    public function link_prediction_data_formator_new(Request $request)
    {
        $link = json_decode($this->read_csv_file($request, null, "linkprediction"));
        $final_result = array("nodes" => array(), "edges" => array());
        $final_node_arr = array();
        $edges_temp_arr = array();
        $unique_nodes = array();

        foreach ($link as $connection) {
            for ($i = 0; $i < sizeof($connection) - 1; $i++) {
                if (!(in_array($connection[$i], $unique_nodes))) {
                    array_push($unique_nodes, $connection[$i]);
                    array_push($final_node_arr, array("id" => $connection[$i]));
                }
            }
        }
        return json_encode($final_node_arr);
    }

    public function linkPrediction(Request $request)
    {
        $input = $_GET['input'];
        // $input = "#nrc";
       // $dir_name = strval($this->get_session_uid($request));
       $dir_name = "netdir"; 
       $algo_option = $_GET['algo_option'];
        switch ($algo_option) {
            case 'adamicadar':
                $algo_choosen_option = '999';
                break;
            case 'jaccardcoeff':
                $algo_choosen_option = '786';
                break;
            default:
                # code...
                break;
        }
        $src = $_GET['src'];
        $k_value = $_GET['k_value'];

        $read_path = "storage/$dir_name/$input.csv";
        // $command = escapeshellcmd('/usr/bin/python /var/www/html/front-end/python_files/generation.py 51 ' . $read_path . ' ' . $input . ' ' . $dir_name . ' ' . $src . ' ' . $dst);

        $command = escapeshellcmd('/usr/bin/python python_files/generation.py ' . $algo_choosen_option . ' ' . $read_path . ' ' . $input . ' ' . $dir_name . ' ' . $src . ' ' . $k_value);
        // echo $command;
        $output = shell_exec($command);
        echo $output;
    }

        // This function is currently being used in shortestpath routes are changed in the routes
        public function shortest_path_data_formator_new(Request $request)
        {
            $link = json_decode($this->read_csv_file($request, null, "shortestpath"));
            $final_result = array();
            $final_node_arr = array();
            $edges_temp_arr = array();
            $unique_nodes = array();
            $paths = array();
    
            foreach ($link as $connection) {
                array_push($paths, $connection);
                foreach ($connection as $data) {
                    array_push($unique_nodes, $data);
                }
            }
    
            $final_result["result"] = $unique_nodes;
            $final_result["paths"] = $paths;
    
            return json_encode($final_result);
        }
   

    public function shortestpath(Request $request)
    {
        $input = $_GET['input'];
        $dir_name = "netdir";
       // $dir_name = strval($this->get_session_uid($request));
        $algo_option = $_GET['algo_option'];
        switch ($algo_option) {
            case 'ShortestPath':
                $algo_choosen_option = '41';
                $k = "null";
                $depth="null";
                break;
            case 'KPossibleShortestPath':
                // $algo_choosen_option = '111';
                $algo_choosen_option = '115';
                break;
            case 'AllPossibleShortestPath':
                $algo_choosen_option = '404';
                //Depth has to be considered
                $depth = "null";
                $k = "null";
                break;
            default:
                # code...
                break;
        }
        $src = $_GET['src'];
        $dst = $_GET['dst'];
        echo $src;
        $read_path = "storage/$dir_name/$input.csv";
        $command = escapeshellcmd('/usr/bin/python python_files/generation.py ' . $algo_choosen_option . ' ' . $read_path . ' ' . $input . ' ' . $dir_name . ' ' . $src . ' ' . $dst . ' ' . $depth . ' ' . $k);
        $output = shell_exec($command);
        echo $output;
    }

    public function community_detection(Request $request)
    {
        // $input = "#modi";
        $input = $_GET['input'];
        $k = $_GET['k'];
        $iterations = $_GET['iterations'];
        $algo_option = $_GET['algo_option'];

       // $dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        $read_path = "storage/$dir_name/$input.csv";
        $handle = fopen($read_path, "r");

        $fline = fgetcsv($handle, ",");
        $fline = fgetcsv($handle, 100, ",");
        $input_network_query = $fline[0];

        switch ($algo_option) {
            case 'lpa':
                $algo_choosen_option = '501';
                $k = 0;
                break;
            case 'grivan':
                // algo_choosen_option was 502 reset it after initial version
                $algo_choosen_option = '502';
                $k = 0;
                break;
            case 'async':
                $algo_choosen_option = '33';
                break;
            default:
                # code...
                break;
        }

        $command = escapeshellcmd('/usr/bin/python python_files/generation.py ' . $algo_choosen_option . ' ' . $read_path . ' ' . $input . ' ' . $dir_name . ' ' . $k . ' ' . $iterations . ' ' . $input_network_query);

        $output = shell_exec($command);
        echo $output;
    }
    

    public function community_data_formator_for_rendering_in_visjs(Request $request)
    {
        $network_arr = json_decode($this->read_csv_file($request));
        $network_community_arr = json_decode($this->read_json_file($request));
        $final_result = array("nodes" => array(), "edges" => array());
        $unique_node_temp_arr = array();
        $final_node_arr = array();
        $edges_temp_arr = array();
        $community_members = array();
        $community_index = -1;
        
        // $GraphData_obj = new GraphData;

        $grp_no = 0;
        //unique node generation 
        foreach ($network_community_arr as $one_community) {

            $community_index = $community_index + 1;
            $community_members[$community_index] = array();

            foreach ($one_community as $one_hash) {
                if (!(array_key_exists($one_hash, $unique_node_temp_arr))) {
                    $unique_node_temp_arr[$one_hash] = 1;
                    
                    if(substr($one_hash,0,1) == "$"){
                        // $output = $GraphData_obj->id_user_mapping($one_hash);
                        //     foreach($output as $op){
                        //     $user_name = $op["author_screen_name"];
                        //     $profile_image_link = $op["profile_image_url_https"];
                        // }
                        // array_push($final_node_arr, array("id" => $one_hash, "label" => $user_name, "group" => $grp_no));
                    }else{
                    array_push($final_node_arr, array("id" => $one_hash, "label" => $one_hash, "group" => $grp_no));
                    }
                    array_push($community_members[$grp_no], $one_hash);
                }
            }
            $grp_no += 1;
        }

        // unique edges generation
        $network_arr = array_slice($network_arr, 1, sizeof($network_arr));
        foreach ($network_arr as $hash_list) {
            $flag = true;
            foreach ($edges_temp_arr as $one) {
                if (($one["from"] == $hash_list[0] && $one["to"] == $hash_list[1]) || ($one["to"] == $hash_list[0] && $one["from"] == $hash_list[1])) {
                    $flag = false;
                    break;
                }
            }
            if ($flag == true) {
                array_push($edges_temp_arr, array("from" => $hash_list[0], "to" => $hash_list[1], "label" => $hash_list[2]));
            }
        }
        $final_result["nodes"] = $final_node_arr;
        $final_result["edges"] = $edges_temp_arr;
        $final_result["groups"] = $community_members;
        return json_encode($final_result);
    }
    

    public function union_data_formator(Request $request)
    {
        $option = $_GET['option'];
        $input_arr = $_GET['input'];
        $input_arr_net = $_GET['inputnetid'];
        $filename = '';
        $input_query_array = array();
        $major_array = array();
        $major_array_index = 0;
        $query_nodes = array();
        $query_nodes_with_color = array();
        $color_counter = 0;
        
        $temp_presence_checker = array();
        

        foreach ($input_arr as $key) {
            $filename = $filename . $key . "_";

            // For reading the first element of the row
            $x = json_decode($this->read_csv_file($request, $key, null));

            // Query nodes to be pushed in this array
            array_push($query_nodes, $x[1][0]);

            $major_array[$major_array_index] = array();

            // Push all the nodes of different graphs 
            foreach ($x as $connection) {
                for ($i = 0; $i < sizeof($connection) - 1; $i++) {
                    // Condition for checking if the element is already present in the major array or not 
                    if (!in_array($connection[$i], $major_array[$major_array_index])) {
                        array_push($major_array[$major_array_index], $connection[$i]);
                    }
                }
            }

            $major_array_index = $major_array_index + 1;
        }


        // Read the union file 
        $link = json_decode($this->read_csv_file($request, $filename, $option));

        $final_result = array("nodes" => array(), "edges" => array());
        $final_node_arr = array();
        $edges_temp_arr = array();
        $unique_nodes = array();
        $color_code_list = array("#00ff00", "#964B00", "#1abc9c", "#5b2c6f", "#ED5565", " #5f6a6a", "#000000", "#FF0000");
        $color_code = "#00ff00";
       // $GraphData_obj = new GraphData;

       // $color_code_list = array("red", "green", "#1abc9c", "#5b2c6f", "#ED5565", " #5f6a6a", "#000000", "orange");
       // $color_code = "red";



        foreach ($link as $connection) {
            // nodes
            for ($i = 0; $i < sizeof($connection) - 1; $i++) {
                
                if (!(in_array($connection[$i], $unique_nodes))) {
                    array_push($unique_nodes, $connection[$i]);

                    for ($counter = 0; $counter < $major_array_index; $counter++) {
                        if (in_array($connection[$i], $major_array[$counter])) {
                            $color_code = $color_code_list[$counter];
                            break;
                        }
                    }

                    ########################### DO NOT REMOVE THIS CODE, THIS CODE CHECKS FOR  THE INTERSECTING NODES #############################
                    for ($counter = 0; $counter < $major_array_index; $counter++) {
                        if (in_array($connection[$i], $major_array[$counter])) {
                            if (($major_array_index - $counter) == 1) {
                                $color_code = $color_code_list[7];
                            } else
                                continue;
                        } else {
                            break;
                        }
                    }
                    ##############################################################################################################################

                // Earlier only this below commented line was there till 25th of April 2020
                
                    if(substr($connection[$i],0,1) == "$"){
                        //         $output = $GraphData_obj->id_user_mapping($connection[$i]);
                        //         foreach($output as $op){
                        //              $user_name = $op["author_screen_name"];
                        //              $profile_image_link = $op["profile_image_url_https"];
                        //         }
                        //  array_push($final_node_arr, array("id" => $connection[$i], "label" =>  $user_name,  "color" => $color_code));
                    }else{
                                array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "color" => $color_code));
                    }
                    
                // if(substr($connection[$i],0,1) == "$"){
                //             $output = $GraphData_obj->id_user_mapping($connection[$i]);
                //             foreach($output as $op){
                //                  $user_name = $op["author_screen_name"];
                //                  $profile_image_link = $op["profile_image_url_https"];
                //             }
                //      array_push($final_node_arr, array("id" => $connection[$i], "label" =>  $user_name, "shape" => 'circularImage', "image" => $profile_image_link, "size" => 50, "borderwidth" => 10, "border" => $color_code ));
                // }else if(substr($connection[$i],0,1) == "#"){
                //              array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'https://image.flaticon.com/icons/svg/1335/1335864.svg' , "size" => 50, "borderwidth" => 5, "border" => $color_code ));
                // }else if(substr($connection[$i],0,1) == "@"){
                //              array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'app/Http/Controllers/graph/roshanmention.jpg' , "size" => 50, "borderwidth" => 5, "border" => $color_code ));
                // }else if(substr($connection[$i],0,1) == "*"){
                //              array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'app/Http/Controllers/graph/keyword.svg' , "size" => 50, "borderwidth" => 5, "border" => $color_code ));
                // }
                    
                    //Recently commented by Roshan
                
                    for($i=0; $i < sizeof($input_arr_net); $i++){
                        if(!in_array($input_arr_net[$i],$temp_presence_checker)){
                            array_push($temp_presence_checker,$input_arr_net[$i]);
                            array_push($query_nodes_with_color, array("query" => $input_arr_net[$i], "color" => $color_code_list[$i]));
                        }
                    }

                    // Uncomment to rollback
                
                    // if (in_array($connection[$i], $query_nodes)) {
                    //     if(substr($connection[$i],0,1) == "$"){
                    //             $output = $GraphData_obj->id_user_mapping($connection[$i]);
                    //             foreach($output as $op){
                    //                  $user_name = $op["author_screen_name"];
                    //                  $profile_image_link = $op["profile_image_url_https"];
                    //             }
                    //             array_push($query_nodes_with_color, array("query" => $user_name, "color" => $color_code_list[$color_counter]));
                    //             $color_counter = $color_counter + 1;
                    //     }else{
                    //             array_push($query_nodes_with_color, array("query" => $connection[$i], "color" => $color_code_list[$color_counter]));
                    //             $color_counter = $color_counter + 1;
                    //     }
                    // }
                }
            }

            // edges
            for ($i = 0; $i < sizeof($connection) - 2; $i++) {
                array_push($edges_temp_arr, array("from" => $connection[$i], "to" => $connection[$i + 1], "label" => $connection[$i + 2]));
            }
            
            $final_result["nodes"] = $final_node_arr;
            $final_result["edges"] = $edges_temp_arr;
            $final_result["querynode"] = $query_nodes_with_color;
            $final_result["major"] = $major_array;
            $final_result["operation"] = $option;
        }
        echo json_encode($final_result);
    }

    public function union(Request $request)
    {
        $input_arr = $_GET['input'];
        $dir_name = "netdir";
       // $dir_name = strval($this->get_session_uid($request));
        // $cmnd_str = "/usr/bin/python /var/www/html/front-end/python_files/generation.py 0 " . $dir_name;
        $cmnd_str = "/usr/bin/python python_files/generation.py 0 " . $dir_name;


        foreach ($input_arr as $input) {
            $read_path = " storage/$dir_name/$input.csv";
            $cmnd_str .= $read_path;
        }
        $command = escapeshellcmd($cmnd_str);
        // echo $command;
        $output = shell_exec($command);
        echo json_encode($output);
    }



    public function intersection(Request $request)
    {
        $input_arr = $_GET['input'];
        //$dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        // $cmnd_str = "/usr/bin/python /var/www/html/front-end/python_files/generation.py 333 1 storage/1/#modi.csv storage/1/#inc.csv";

        $cmnd_str = "/usr/bin/python python_files/generation.py 333 " . $dir_name;


        foreach ($input_arr as $input) {
            $read_path = " storage/$dir_name/$input.csv";
            $cmnd_str .= $read_path;
        }


        $command = escapeshellcmd($cmnd_str);
        $output = shell_exec($command);
        echo json_encode($output);
    }

    public function difference_data_formator(Request $request)
    {
        $option = $_GET['option'];
        $input_arr = $_GET['input'];
        $filename = '';
        $input_query_array = array();
        $major_array = array();
        $major_array_index = 0;
        $query_nodes = array();
        $query_nodes_with_color = array();
        $unique_nodes = array();
        $edges_temp_arr = array();
        $final_node_arr = array();
        $intersecting_nodes_with_color_info = array();
        $edges_to_be_used_while_saving = array();
        $color_counter = 0;
     //   $GraphData_obj = new GraphData;


        $color_code_list = array("#00ff00", "#964B00", "#1abc9c", "#5b2c6f", "#ED5565", " #5f6a6a", "#000000", "#FF0000");
        $faded_color_code_list = array("#e6ffe6", "#fff2e6", "#e9fcf8", "#f4edf8", "#f8bac0", "#e4e7e7", "#d9d9d9", "#FF0000");

        $counter = 0;

        foreach ($input_arr as $key) {
            $filename = $filename . $key . "_";

            // For reading the first element of the row
            $x = json_decode($this->read_csv_file($request, $key, null));

            array_push($query_nodes, $x[1][0]);

            $major_array[$major_array_index] = array();
            $ignore_two_rows = 0;
            foreach ($x as $connection) {
                if ($ignore_two_rows >= 2) {
                    for ($i = 0; $i < sizeof($connection) - 1; $i++) {

                        array_push($major_array[$major_array_index], $connection[$i]);

                        // Getting the unique nodes
                        if (!(in_array($connection[$i], $unique_nodes))) {
                            array_push($unique_nodes, $connection[$i]);
                           
                         // Earlier only the following line was there before 26th of April 2020
                        if(substr($connection[$i],0,1) == "$"){
                            //         $output = $GraphData_obj->id_user_mapping($connection[$i]);
                            //         foreach($output as $op){
                            //              $user_name = $op["author_screen_name"];
                            //              $profile_image_link = $op["profile_image_url_https"];
                            //         }
                            //    array_push($final_node_arr, array("id" => $connection[$i], "label" => $user_name, "color" => $faded_color_code_list[$counter]));
                        }else{
                               array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "color" => $faded_color_code_list[$counter]));
                        }
                           
                            // if(substr($connection[$i],0,1) == "$"){
                            //      $output = $GraphData_obj->id_user_mapping($connection[$i]);
                            //      foreach($output as $op){
                            //         $user_name = $op["author_screen_name"];
                            //         $profile_image_link = $op["profile_image_url_https"];
                            //     }
                            //     array_push($final_node_arr, array("id" => $connection[$i], "label" =>  $user_name, "shape" => 'circularImage', "image" => $profile_image_link, "size" => 50, "borderwidth" => 10, "border" =>  $faded_color_code_list[$counter] ));
                            // }else if(substr($connection[$i],0,1) == "#"){
                            //     array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'https://image.flaticon.com/icons/svg/1335/1335864.svg' , "size" => 50, "borderwidth" => 5, "border" =>  $faded_color_code_list[$counter] ));
                            // }else if(substr($connection[$i],0,1) == "@"){
                            //     array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'app/Http/Controllers/graph/roshanmention.jpg' , "size" => 50, "borderwidth" => 5, "border" =>  $faded_color_code_list[$counter] ));
                            // }else if(substr($connection[$i],0,1) == "*"){
                            //     array_push($final_node_arr, array("id" => $connection[$i], "label" => $connection[$i], "shape" => 'circularImage', "image" => 'app/Http/Controllers/graph/keyword.svg' , "size" => 50, "borderwidth" => 5, "border" => $faded_color_code_list[$counter] ));
                            // }
                        }
                    }

                    $flag = true;
                    for ($i = 0; $i < sizeof($connection) - 2; $i++) {
                        foreach ($edges_temp_arr as $arr) {
                            if (($arr["from"] == $connection[$i] && $arr["to"] == $connection[$i + 1]) || ($arr["to"] == $connection[$i] && $arr["from"] == $connection[$i + 1])) {
                                $flag = false;
                                break;
                            }
                        }
                        if ($flag == true) {
                            array_push($edges_temp_arr, array("from" => $connection[$i], "to" => $connection[$i + 1], "label" => $connection[$i + 2]));  //, "arrows" => 'to'
                        }
                    }
                }
                $ignore_two_rows = $ignore_two_rows + 1;
            }
            $major_array_index = $major_array_index + 1;
            $counter = $counter + 1;
        }


        $link = json_decode($this->read_csv_file($request, $filename, $option));
        $node_color_to_be_changed = array();

        // A temporary array for maintaining the intersecting node for color change of the connected nodes with the intersecting nodes
        $intersecting_nodes = array();

        for ($i = 0; $i < sizeof($link[0]); $i++) {
            for ($j = 0; $j < sizeof($final_node_arr); $j++) {
                if ($link[0][$i] == $final_node_arr[$j]["id"]) {
                    if ($option == "intersection") {
                        $final_node_arr[$j]["color"] = "#FF0000";
                    } else {
                        $final_node_arr[$j]["color"] = "#5c2480";
                    }

                    if ($option == "intersection") {
                        if(substr($final_node_arr[$j]["id"],0,1) == "$"){
                                    $output = $GraphData_obj->id_user_mapping($connection[$i]);
                                    foreach($output as $op){
                                         $user_name = $op["author_screen_name"];
                                         $profile_image_link = $op["profile_image_url_https"];
                                    }
                            array_push($intersecting_nodes,  $user_name);  
                        }
                        array_push($intersecting_nodes, $final_node_arr[$j]["id"]);
                    }
                    
                        if(substr($final_node_arr[$j]["id"],0,1) == "$"){
                            //         $output = $GraphData_obj->id_user_mapping($final_node_arr[$j]["id"]);
                            //         foreach($output as $op){
                            //              $user_name = $op["author_screen_name"];
                            //              $profile_image_link = $op["profile_image_url_https"];
                            //         }
                            //    array_push($intersecting_nodes_with_color_info,array("nodes" => $user_name, "color" => "#FF0000"));
                        }else{
                               array_push($intersecting_nodes_with_color_info, array("nodes" => $final_node_arr[$j]["id"], "color" => "#FF0000"));
                        }
                }
            }
        }

        for ($j = 0; $j < sizeof($edges_temp_arr); $j++) {
            if ((in_array($edges_temp_arr[$j]["from"], $link[0])) && (in_array($edges_temp_arr[$j]["to"], $link[0]))) {
                $flag = true;
                foreach ($edges_to_be_used_while_saving as $arr) {
                    if (($arr["from"] == $edges_temp_arr[$j]["from"] && $arr["to"] == $edges_temp_arr[$j]["to"]) || ($arr["from"] == $edges_temp_arr[$j]["to"] && $arr["to"] == $edges_temp_arr[$j]["from"])) {
                        $flag = false;
                        break;
                    }
                }
                if ($flag == true) {
                    array_push($edges_to_be_used_while_saving, array("from" => $edges_temp_arr[$j]["from"], "to" => $edges_temp_arr[$j]["to"], "label" => $edges_temp_arr[$j]["label"]));
                }
            }
        }



        $final_result = array("nodes" => array(), "edges" => array());

        $final_result["nodes"] = $final_node_arr;
        $final_result["edges"] = $edges_temp_arr;
        $final_result["querynode"] = $query_nodes;
        $final_result["info"] = $intersecting_nodes_with_color_info;
        $final_result["option"] = $option;
        $final_result["edges_to_be_used_while_saving"] = $edges_to_be_used_while_saving;

        return json_encode($final_result);
    }

    public function read_json_file(Request $request)
    {
        $dir_name = "netdir";
        //$dir_name = strval($this->get_session_uid($request));
        $input = $_GET['input'];
        $input = $input . "communities.json";
        $csvFile = file_get_contents("storage/$dir_name/$input");
        $json = json_decode($csvFile);
        return json_encode($json);
    }

    public function difference(Request $request)
    {
        $input_arr = $_GET['input'];
        //$dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        // $cmnd_str = "/usr/bin/python /var/www/html/front-end/python_files/generation.py 222 1 storage/1/#modi.csv storage/1/#inc.csv";

        $cmnd_str = "/usr/bin/python python_files/generation.py 222 " . $dir_name;


        foreach ($input_arr as $input) {
            $read_path = " storage/$dir_name/$input.csv";
            $cmnd_str .= $read_path;
        }


        $command = escapeshellcmd($cmnd_str);
        $output = shell_exec($command);
        echo json_encode($output);
    }

    public function write_delete(Request $request)
    {
        $data = json_decode($_POST['input'], true);
        $unique_id = $_POST['uniqueid'];

        //$dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        
        $processed_array = array();

        for ($i = 0; $i < sizeof($data); $i++) {
            $x = $data[$i]["from"];
            $y = $data[$i]["to"];
            $z = $data[$i]["label"];
            $processed_array[] = [$x, $y, $z];
        }


        // Check whether the directory is already created
        if (!file_exists("storage/$dir_name")) {
            mkdir("storage/$dir_name");
        }

        $file = fopen("storage/$dir_name/$unique_id.csv", "w");
        $filename = base_path("storage/$dir_name/$unique_id.csv");

        //Create headers
        $line = ['from', 'to', 'count'];
        fputcsv($file, $line);

        $parts = (array_chunk($processed_array, 1000));

        foreach ($parts as $lines) {
            foreach ($lines as $line) {
                fputcsv($file, $line);
            }
        }
        fclose($file);
    }

    public function requestToSpark(Request $request)
    {
        $query_list = $_GET['query_list'];
        $rname = $_GET['rname'];
        $result = $this->curlData($query_list, $rname);
        $result = json_decode($result, true);

        //echo json_encode($result);
        //echo json_encode(array('query_time' => $rname, 'status' => $result['state'], 'id' => $result['id']));
        $id = $result['id'];

        while (1) {
            $re = $this->getStatusFromSpark($id);
               // echo $re['status'];
            if ($re['status'] == 'success')
                    break;
            sleep(10);
            }

        $filename_arr = array_slice($query_list, 1, sizeof($query_list));
        $filename_to_write = $this->get_filename($query_list[0], $filename_arr);

        $re1 = $this->getOuputFromSparkAndStoreAsJSON($request, $id, $filename_to_write, $query_list[0]);

        return json_encode($re1);
    }

    private function get_filename($algo, $filename_arr)
    {
        if ($algo == 'PageRank')
            $filename = $filename_arr[0] . 'centralities.csv';
        else if ($algo == 'degcen')
            //DegreeCentrality
            $filename = $filename_arr[0] . 'centralities.csv';
        else if($algo == 'intersection'){
            $filename = $filename_arr[0];
            for($i = 1; $i<sizeof($filename_arr); $i++){                
                $filename = $filename.'_'.$filename_arr[$i];
            }
            $filename = $filename. '_intersection.csv';
        }
        else if($algo == 'union'){
            $filename = $filename_arr[0];
            for($i = 1; $i<sizeof($filename_arr); $i++){
                $filename = $filename.'_'.$filename_arr[$i];
            }
            $filename = $filename. '_union.csv';
        }
        else if($algo == 'difference'){
            $filename = $filename_arr[0];
            for($i = 1; $i<sizeof($filename_arr); $i++){
                $filename = $filename.'_'.$filename_arr[$i];
            }
            $filename = $filename. '_difference.csv';
        }else if($algo == 'lpa'){
            $filename = $filename_arr[0] . 'communities.json';
        }else if($algo == 'ShortestPath'){
            $filename = $filename_arr[0] . 'shortestpath.csv';
        }

        return $filename;
    }


    public  function  curlData($query_list, $rname)
    {
        $curl = curl_init();
        $data['conf'] = array('spark.jars.packages' => 'anguenot:pyspark-cassandra:2.4.0', 'spark.cassandra.connection.host' => '10.0.0.11', 'spark.cores.max' => 16);
        $data['file'] = 'local:/home/admin/bbk/sigma/spark/batch/file_reader_net_ops.py';
        $data['args'] = $query_list;
        $data['name'] = strval($rname) . 'a786';
        $data['executorCores'] = 8;
        $data['numExecutors'] = 2;
        $data['executorMemory'] = '25G';
        $data['driverMemory'] = '1G';
        $data = json_encode($data);
        // echo $data;
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Connection: Keep-Alive'
        ));
        curl_setopt($curl, CURLOPT_URL, '172.16.117.202:8998/batches');
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 0);
        $curl_result = curl_exec($curl);
        return $curl_result;
    }


    public function fileUploadRequest(Request $request)
    {
        // $file = "storage/5e0c9c863e4af/01416885.csv";
        $filename_arr =  $_GET['filename_arr'];
        //$dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "172.16.117.202/upload.php");
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Connection: Keep-Alive'
        ));

        $temp_data = array();
        for($i = 0; $i<sizeof($filename_arr); $i++){
            $file =  "storage/$dir_name/$filename_arr[$i].csv";
            $cfile = new CurlFile($file,  'text/csv', $filename_arr[$i].".csv"); //curl file itself return the realpath with prefix of @
            $temp_data['file['.$i.']'] = $cfile ;
        }
        // echo json_encode($temp_data);
       
        $data = $temp_data;
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $curl_response = curl_exec($curl);
        curl_close($curl);
        return json_encode($curl_response);
    }


    // Added by Roshan
    public function getStatusFromSpark($id)
    {
        //curl -X GET -H "Content-Type: application/json" 172.16.117.202:8998/batches/{80}
        // $id =  $_GET['id'];
        $curl_result = curl_init();
        curl_setopt($curl_result, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        $url = '172.16.117.202:8998/batches/' . $id;
        curl_setopt($curl_result, CURLOPT_URL, $url);
        curl_setopt($curl_result, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_result, CURLOPT_TIMEOUT, 0);
        $curl_result = curl_exec($curl_result);
        // echo $curl_result;
        $result = json_decode($curl_result, true);
        // return json_encode(array('status' => $result['state'], 'id' => $result['id']));
        return array('status' => $result['state'], 'id' => $result['id']);
    }


    public function getOuputFromSparkAndStoreAsJSON(Request $request, $id, $filename, $algo_option)
    {
        //curl -X GET -H "Content-Type: application/json" 172.16.117.202:8998/batches/{80}
        // $id =  $_GET['id'];
        // $filename = $_GET['filename'];
        $curl_result = curl_init();
        curl_setopt($curl_result, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        $url = '172.16.117.202:8998/batches/' . $id;
        curl_setopt($curl_result, CURLOPT_URL, $url);
        curl_setopt($curl_result, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_result, CURLOPT_TIMEOUT, 0);
        $curl_result = curl_exec($curl_result);
        $result = json_decode($curl_result, true);
        // return $curl_result['state'];

        $result = $result["log"][8]; //string type             
        $result =  str_replace(array("'", "&quot;"), "\"", htmlspecialchars($result));  //convert "'" to "\""

        $result = json_decode($result, true); //array type 
        // var_dump($result);



        // echo $result;
        $this->storeAsCSV($request, $filename, $result, $algo_option);

        return array('status' => 'done', 'id' => $id);
    }



    public function storeAsJson(Request $request, $filename, $result_arr)
    {
       // $dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        // Check whether the directory is already created
        if (!file_exists("storage/$dir_name")) {
            mkdir("storage/$dir_name");
        }

        $fp = fopen("storage/$dir_name/$filename", "w");

        
        $result = array();
        foreach ($result_arr as $key => $value) {
            $result[$value['label']] = $value['hashtag_list'];
        }

        // echo json_encode($result);
        fwrite($fp, json_encode($result, JSON_PRETTY_PRINT));
        fclose($fp);
    }



    public function storeAsCSV(Request $request, $filename, $result_arr, $algo_option)
    {
       // $dir_name = strval($this->get_session_uid($request));
        $dir_name = "netdir";
        // Check whether the directory is already created
        if (!file_exists("storage/$dir_name")) {
            mkdir("storage/$dir_name");
        }

        $fp = fopen("storage/$dir_name/$filename", "w");

        if(($algo_option == 'PageRank') or ($algo_option == 'degcen') ){
            foreach ($result_arr as $key => $value) {
                $line = array($value['id'], $value['pagerank']);
                fputcsv($fp, $line);
            }
        }
        else if(($algo_option == 'difference') or ($algo_option == 'intersection') ){
            error_reporting(0);
            $rt = array();
            foreach ($result_arr as $key => $value) {
                // $line = array($value['src']);
                array_push($rt, $value['src']);           
            }
            fputcsv($fp, $rt);
        }
        else if($algo_option == 'union'){
            error_reporting(0);
            foreach ($result_arr as $key => $value) {
                $line = array($value['src'], $value['dst'], $value["count"]);
                fputcsv($fp, $line);
            }
        }else if($algo_option == 'lpa'){
            $this->storeAsJson($request, $filename, $result_arr);
        }else if($algo_option == 'ShortestPath'){
            $rt = array();
            foreach ($result_arr as $key => $value) {
                array_push($rt, $value['0']);           
            }
            fputcsv($fp, $rt);
        }

        fclose($fp);
    }

}