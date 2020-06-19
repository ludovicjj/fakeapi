<?php


class Validator
{
    private $data;
    private $errors = [];

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function check(string $name, string $rule, $options = false)
    {
        $validator = 'validate'.ucfirst($rule);
        if (!$this->$validator($name, $options)) {
            $this->errors[$name] = "Le champs $name n'a pas été rempli correctement";
        }
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    private function validateRequired($name, $options)
    {
        return array_key_exists($name, $this->data) && $this->data[$name] !== '';
    }

    private function validateEmail($name, $options)
    {
        return array_key_exists($name, $this->data) && filter_var($this->data[$name], FILTER_VALIDATE_EMAIL);
    }

    private function validateIn($name, $options)
    {
        return array_key_exists($name, $this->data) && in_array($this->data[$name], $options);
    }
}