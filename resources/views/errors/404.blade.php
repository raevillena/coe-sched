@extends('errors::minimal')

@section('title', 'Page Not Found')
@section('code', '404')
@section('message', __('Not Found'))

{{-- customize --}}
{{-- @section('message') --}}
    {{-- <div style="text-align:center; margin-top: 60px;">
        <p style="font-size: 100px">Error 404</p>
    </div> --}}
{{-- @endsection --}}
