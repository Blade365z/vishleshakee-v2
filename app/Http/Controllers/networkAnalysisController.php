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
                            $output = $GraphData_obj->id_user_mapping($connection[$i]);
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
        $input = $_GET['input'];
       // $dir_name = strval($this->get_session_uid($request));
       // $read_path = "storage/$dir_name/$input.csv";
        $dir_name = "netdir";
        $read_path = "storage/netdir/$input.csv";
        $algo_option = $_GET['algo_option'];
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
        //echo $output;
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
                $k = null;
                break;
            case 'KPossibleShortestPath':
                // $algo_choosen_option = '111';
                $algo_choosen_option = '115';
                break;
            case 'AllPossibleShortestPath':
                $algo_choosen_option = '404';
                break;
            default:
                # code...
                break;
        }
        $src = $_GET['src'];
        $dst = $_GET['dst'];
        
        // $max_gen_node = $_GET["max_gen_node"];
        $depth="null";
        $k = "null";

        $read_path = "storage/$dir_name/$input.csv";
        $command = escapeshellcmd('/usr/bin/python python_files/generation.py ' . $algo_choosen_option . ' ' . $read_path . ' ' . $input . ' ' . $dir_name . ' ' . $src . ' ' . $dst . ' ' . $depth . ' ' . $k);
        // $command = escapeshellcmd('/usr/bin/python /var/www/html/front-end/python_files/generation.py 41 ' . $read_path . ' ' . $input . ' ' . $dir_name . ' ' . $src . ' ' . $dst);
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
        echo gettype($input_network_query);

        switch ($algo_option) {
            case 'lpa':
                $algo_choosen_option = '501';
                // $k = 0;
                break;
            case 'Grivan Newman':
                // algo_choosen_option was 502 reset it after initial version
                $algo_choosen_option = '501';
                $k = 0;
                break;
            case 'AsyncFluidic':
                $algo_choosen_option = '33';
                break;
            default:
                # code...
                break;
        }
        echo $algo_choosen_option;

        $command = escapeshellcmd('/usr/bin/python python_files/generation.py ' . $algo_choosen_option . ' ' . $read_path . ' ' . $input . ' ' . $dir_name . ' ' . $k . ' ' . $iterations . ' ' . $input_network_query);

        echo $command;
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
        
         $GraphData_obj = new GraphData;

        $grp_no = 0;
        //unique node generation 
        foreach ($network_community_arr as $one_community) {

            $community_index = $community_index + 1;
            $community_members[$community_index] = array();

            foreach ($one_community as $one_hash) {
                if (!(array_key_exists($one_hash, $unique_node_temp_arr))) {
                    $unique_node_temp_arr[$one_hash] = 1;
                    
                    if(substr($one_hash,0,1) == "$"){
                        $output = $GraphData_obj->id_user_mapping($one_hash);
                            foreach($output as $op){
                            $user_name = $op["author_screen_name"];
                            $profile_image_link = $op["profile_image_url_https"];
                        }
                        array_push($final_node_arr, array("id" => $one_hash, "label" => $user_name, "group" => $grp_no));
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
    



}