<?php

namespace App\DBModel;

use Illuminate\Database\Eloquent\Model;
use Cassandra;
use App\DBModel\DBmodel;

class DBmodelAsync extends Model
{
    private function db_connection($type)
    {
        /*------------------DATABASE CREDENTIALS-------------------------*/
        $db_obj = new DBmodel;
        $session = $db_obj->establish_db_connection($type);
        return $session;
    }


    /*
        Function - For Prepared statement to be executed in Cassandra asynchronously
        input - array(array(element1, element1), array(element1, element1), array(element1, element1), ...)
        ouput - Cassandra Future Row Object
    */
    public function executeAsync_query($input_args, $prepared_statement,$type=null)
    {

        $session = $this->db_connection($type);
        $futures   = array();
        $result   = array();
        $prepared_statement = $session->prepare($prepared_statement);

        // execute all statements in background
        foreach ($input_args as $arguments) {
            $futures[] = $session->executeAsync($prepared_statement, array(
                'arguments' => $arguments
            ));
        }

        // wait for all statements to complete
        foreach ($futures as $future) {
            $result[] = $future->get(15);  // we will not wait for each result for more than 5 seconds       
        }

        // $token_count_array = array();
        // foreach ($result as $row) {
        //     $t = $row['created_date'];
        //     array_push($token_count_array, array(get_date_time_from_cass_date_obj($t), $row['created_time'], $row['count']));
        //     // echo $row['count'] . PHP_EOL;
        // }

        return $result;
    }
}