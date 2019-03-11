<?php
	function get_role_level($role) {
		switch (strtolower($role)) {
			case 'admin':
				$level = '1';
				break;
			case 'manager':
				$level = '2';
				break;
			case 'employee':
				$level = '3';
				break;
		}
		return $level;
	}
?>