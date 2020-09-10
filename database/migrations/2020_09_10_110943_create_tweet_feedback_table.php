<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTweetFeedbackTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tweet_feedback', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('userID');
            $table->string('feedbackType');
            $table->string('tweetID');
            $table->string('originalTag');
            $table->string('feedbackTag');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tweet_feedback');
    }
}
