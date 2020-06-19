<?php


class Form
{
    /** @var array|null $data */
    private $data;

    public function __construct(?array $data = null)
    {
        $this->data = $data;
    }

    public function text(string $name, string $label): string
    {
        return $this->input('text', $name, $label);
    }

    public function email(string $name, string $label): string
    {
        return $this->input('email', $name, $label);
    }

    public function textarea(string $name, string $label): string
    {
        return $this->input('textarea', $name, $label);
    }

    public function select(string $name, string $label, array $options): string
    {
        $label = $this->getLabel($name, $label);
        $input = "<select id=\"service\" name=\"service\" class=\"form-control\">";
        $input .= $this->getOptions($name, $options);
        $input .= "<select>";
        return $this->surround($label . $input);
    }

    public function submit(string $label)
    {
        return "<button type=\"submit\" class=\"btn btn-primary\">$label</button>";
    }

    private function input(string $type, string $name, string $label)
    {
        $label = $this->getLabel($name, $label);
        $value = $this->getValue($name);
        $input = "<input name=\"$name\" id=\"$name\" type=\"text\" class=\"form-control\" value=\"$value\">";
        if ($type === 'textarea') {
            $input = "<textarea id=\"$name\" name=\"$name\" class=\"form-control\">$value</textarea>";
        }

        return $this->surround($label . $input);
    }

    private function getLabel(string $name, string $label)
    {
        return "<label for=\"$name\">$label</label>";
    }

    private function getOptions(string $name, array $options)
    {
        $value = (int)$this->getValue($name);
        $htmlOptions = '';
        foreach ($options as $key => $option) {
            $selected = '';
            if ($value === $key) {
                $selected = 'selected';
            }
            $htmlOptions .= "<option $selected value=\"$key\">$option</option>";
        }
        return $htmlOptions;
    }

    private function surround(string $input): string
    {
        return "<div class=\"form-group\">" . $input . "</div>";
    }

    private function getValue(string $name): string
    {
        $value = "";
        if (isset($this->data[$name])) {
            $value = $this->data[$name];
        }
        return $value;
    }
}