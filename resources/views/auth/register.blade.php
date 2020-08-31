@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow">
         
                <div class="card-body">
                    <form method="POST" action="{{ route('register') }}">
                        @csrf
                        <div class="text-center  mb-4 border-bottom">
                    <a class="navbar-brand m-0" href="/home"><img src="public/img/vishnavLogo.png" height="30px" /> </a>
                        <p>Please fill the form</p>
                    </div>
                        <div class="form-group row">
                            <label for="username" class="col-md-4 col-form-label text-md-right">{{ __('UserName') }}</label>

                            <div class="col-md-6">
                                <input id="username" type="text" class="form-control smat-rounded @error('username') is-invalid @enderror" name="username" value="{{ old('username') }}" required autocomplete="username" autofocus>

                                @error('username')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                        <label for="organization" class="col-md-4 col-form-label text-md-right">{{ __('Select Organization') }}</label>
                            <div class="col-md-6">
                                <select  class="form-control smat-rounded" name="organization" id="organization">
                                    <option value="iitg">IIT-Guwahati</option>
                                    <option value="mha">M.H.A</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                        <label for="role" class="col-md-4 col-form-label text-md-right">{{ __('Select Role') }}</label>
                            <div class="col-md-6">
                                <select  class="form-control smat-rounded " name="role" id="role">
                                    <option value="3">Guest</option>
                                    <option value="2">Administrator</option>
                                    <option value="1">Master</option> 
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="email" class="col-md-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control smat-rounded  @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control smat-rounded  @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password-confirm" class="col-md-4 col-form-label text-md-right">{{ __('Confirm Password') }}</label>

                            <div class="col-md-6">
                                <input id="password-confirm" type="password" class="form-control smat-rounded " name="password_confirmation" required autocomplete="new-password">
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary smat-rounded">
                                    {{ __('Register') }}
                                </button>
                                <a class="mx-2" href="  home"> Go back home. </a> 
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection