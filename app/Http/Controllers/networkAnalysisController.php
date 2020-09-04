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

}