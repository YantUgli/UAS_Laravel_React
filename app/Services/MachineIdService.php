<?php

namespace App\Services;

class MachineIdService
{
    public static function generate(): string
    {
        $data = php_uname()
              . gethostname()
              . base_path();

        return hash('sha256', $data);
    }
}