@extends('layouts.app')

@section('content')
<div class="container  ">
    <div class="row justify-content-center ">
        <div class="col-md-8">
            <div class="card shadow mt-5" style="border:0px;border-radius:24px;">

                <div class="card-body">
                    <div class="text-center  mb-4 border-bottom">
                    <a class="navbar-brand" href="/home"><img src="public/img/vishnavLogo.png" height="30px" /> </a>
                        <p> Please Login using your credentials </p>
                    </div>
                    <form method="POST" action="login">
                        @csrf

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
                            <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control smat-rounded @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6 offset-md-4">

                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary smat-rounded">
                                    {{ __('Login') }}
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
