<?php namespace app\Http\Controllers\Auth;

/**
 * Created by Curious Minds Media.
 * User: Andrew Engstrom (andrew@curiousm.com)
 * Date: 7/11/16
 * Time: 3:19 PM
 */

use app\Http\Controllers\Controller;
use app\Models\User;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Validator;

class AuthController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectPath = '/dashboard';
    protected $loginPath = '/';
    protected $redirectAfterLogout = '/';

    public function __construct()
    {
        $this->middleware('guest', ['except' => ['logout', 'getLogout']]);
    }

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function loginUsername()
    {
        return property_exists($this, 'username') ? $this->username : 'username';
    }

    public function postLogin(Request $request)
    {
        $credentials = [
            'username' => $request->get('username'),
            'password' => $request->get('password'),
        ];

        if (Auth::attempt($credentials, true)) {

            // Update the last logged in for the user...
            $updateUser             = User::where('id', '=', Auth::user()->id)->first();
            $updateUser->last_login = date('Y-m-d');
            $updateUser->save();

            return redirect()->intended($this->redirectPath());
        } else {
            return redirect()->back()->withErrors(['Wrong User Name or Password', 'Please check your credentials and try again.']);
        }
    }

    public function getLogout()
    {
        Auth::logout();
        Session::flush();

        return redirect('/');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array $data
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make(
            $data, [
                'username' => 'required|max:255|unique:users',
                'password' => 'required|min:6|confirmed',
            ]
        );
    }
}
