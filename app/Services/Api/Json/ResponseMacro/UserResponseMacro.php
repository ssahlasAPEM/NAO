<?php namespace app\Services\Api\Json\ResponseMacro;

/**
 * Created by Curious Minds Media.
 * User: Andrew Engstrom (andrew@curiousm.com)
 * Date: 7/11/16
 * Time: 3:30 PM
 */

use app\Core\User\Model\User;

/**
 * Class UserResponseMacro
 * @package app\Services\Api\Json\ResponseMacro
 */
class UserResponseMacro extends AbstractResponseMacro
{

    /**
     * @return string
     */
    public function responseType()
    {
        return 'user';
    }

    public function targetClass()
    {
        return User::class;
    }
}
