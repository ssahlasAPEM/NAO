<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOpportunitiesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'opportunities', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->boolean('draft')->default(true);
            $table->string('state')->default('Open');
            $table->string('status')->nullable();
            $table->string('stage')->default('quote');
            $table->string('company')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state_county')->nullable();
            $table->string('mail_code')->nullable();
            $table->string('country')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_title')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('sales_rep_agent')->nullable();
            $table->string('distributor')->nullable();
            $table->string('apem_sales_person')->nullable();
            $table->string('sra_sales_rep')->nullable();
            $table->string('distributor_salesperson')->nullable();
            $table->string('industry')->nullable();
            $table->string('application')->nullable();
            $table->string('reason_for_opp')->nullable();
            $table->string('function')->nullable();
            $table->boolean('catalog_product')->default(true);
            $table->string('catalog_part_num')->nullable();
            $table->string('customer_part_num')->nullable();
            $table->string('product_type')->nullable();
            $table->string('product_series')->nullable();
            $table->string('apem_part_num')->nullable();
            $table->string('brief_description')->nullable();
            $table->string('extended_description')->nullable();
            $table->string('current_supplier')->nullable();
            $table->string('competitors')->nullable();
            $table->string('year1_sales_vol')->nullable();
            $table->string('year2_sales_vol')->nullable();
            $table->string('year3_sales_vol')->nullable();
            $table->string('currency')->nullable();
            $table->string('target_sales_price')->nullable();
            $table->float('potential_annual_rev')->nullable();
            $table->string('probability_of_win')->nullable();
            $table->float('expected_value')->nullable();
            $table->date('quote_date')->nullable();
            $table->date('sample_date')->nullable();
            $table->date('approval_date')->nullable();
            $table->date('date_rcvd_prod_order')->nullable();
            $table->date('estimated_prod_date')->nullable();
            $table->string('prod_sales_order_num')->nullable();
            $table->string('reason_for_win')->nullable();
            $table->date('date_lost')->nullable();
            $table->string('lost_to_whom')->nullable();
            $table->string('reason_for_loss')->nullable();
            $table->text('comment_field')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('opportunities');
    }
}
