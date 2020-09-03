<?php


/*
 DISCLAIMER


    This file was created by Amitabh Baruah on 28-10-2019 in
    OSiNT Lab, IIT Guwahati as a part of the Tweet-Analytics project.

   LICENSE

    All rights reserved. No part of this file maybe
    reproduced or used in any manner whatsoever without the
    express written permission of the owner.
    Refer to the file "LICENSE" for full license details.

*/


namespace App\DBModel;

use Illuminate\Database\Eloquent\Model;
use Cassandra;
use Illuminate\Database\Events\StatementPrepared;
use mysqli;
use Session;

/**
 * This is the Database Model of the system for the Database queries
 * The user credentials are retrived from the osint_conf.ini file
 *-------------------------------------------
 * Note : PHP-CASSANDRA DRIVER IS REQUIRED
 * ------------------------------------------
 *
 */

class DBmodel extends Model
{
    public function establish_db_connection($type_arg)
    {
        // $osint_DB = parse_ini_file("/var/www/osint_conf.ini"); // The Database Configuration file
        // $userId = env('CASSANDRA_UNAME');
        // $pwd =  env('CASSANDRA_PASS');
        // $cassandra_nodes = env('CASSANDRA_NODES');
        // if($type_arg=='raw'){
        //     $keyspace =  env('KEYSPACE1');
        // }else{
        //     $keyspace =  env('KEYSPACE2');
        // }
        $userId = 'cassandra';
        $pwd = 'cassandra';
        $keyspace = 'processed_keyspace';
        $cassandra_nodes = '172.16.117.201, 172.16.117.202, 172.16.117.204';
        
        $cluster = Cassandra::cluster()->withRoundRobinLoadBalancingPolicy()->withContactPoints($cassandra_nodes)->withDefaultConsistency(Cassandra::CONSISTENCY_LOCAL_QUORUM)->withDefaultPageSize(100000000000000)->withCredentials($userId, $pwd)->withPort(9042)->withPersistentSessions(true)->withConnectTimeout(900)->build();
        $session   = $cluster->connect($keyspace);
        return $session;
    }



    public function execute_query($statement, $options = null, $type=null)
    {        
        $session = $this->establish_db_connection($type);

        if ($options) {
            $result = $session->execute($statement, $options);
        } else {
            $result = $session->execute($statement);
        }

        return $result;
    }


    /*
    Function - For Prepared statement to be executed in Cassandra synchronously
    input - array(element1, element1, ...)
    ouput - Cassandra Row Object
    */
    public function execute_query_prepared($args, $prepared_statement, $page_size, $type=null)
    {
        /*------------------DATABASE CREDENTIALS-------------------------*/
        $session = $this->establish_db_connection($type);
        $options = array('arguments' => $args, 'page_size' => $page_size);
        $result = $session->execute($prepared_statement, $options);
        return $result;
    }



    public function execute_query_first_require($statement,$option=null,$type=null)  //for the queries that requires first
    {
        $first_required = $this->execute_query($statement,$option=null,$type);
        $first_required = $first_required->first();
        return $first_required;
    }





    public function execute_query_in_mysql($statement)
    {
        /*------------------DATABASE CREDENTIALS-------------------------*/
       // $osint_mysqlDB = parse_ini_file("/var/www/osint_conf.ini"); // The Database Configuration file
        $userId = env('MYSQL_USER');
        $pwd = env('MYSQL_PASS');
        $ip = env('MYSQL_IP');
        $db = env('MYSQL_DB');
        /*----------------------------------------------------------------*/
        // Create connection
        $conn = mysqli_connect($ip, $userId, $pwd, $db);
        $result = mysqli_query($conn, $statement);
        return $result;
    }



    public function prepared_execute_mysql($statement, $data, $action)
    {
        //$osint_mysqlDB = parse_ini_file("/var/www/osint_conf.ini"); // The Database Configuration file
        $userId = env('MYSQL_USER');
        $pwd = env('MYSQL_PASS');
        $ip = env('MYSQL_IP');
        $db = env('MYSQL_DB');
        $conn =  new mysqli($ip, $userId, $pwd, $db);
        // $types = str_repeat('s', count($data));

        $type = '';
        foreach ($data as $key) {
            $dtype = gettype($key);
            if ($dtype == 'integer') {
                $dtype = 'i';
            } elseif ($dtype == 'string') {
                $dtype = 's';
            }
            $type = $dtype . $type;
        }
        $type = strrev($type);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        
        $stmt = $conn->prepare($statement);
        $stmt->bind_param($type, ...$data);
        $stmt->execute();

        if ($action == 'check') {
            $result = $stmt->get_result();
            $arr = array();
            while ($row = $result->fetch_row()) {
                $arr = $row;
            }
            if (!$arr)
                return ('empty');
            else
                return ($arr);
        } else if ($action == 'checkAll') {
            $final_arr = array();
            $result = $stmt->get_result();
            while ($row = $result->fetch_row()) {                   
                array_push($final_arr, $row);
            }
            return ($final_arr);
        }
        
        $stmt->close();
        return;
    }
}