import ibmiotf.application
import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)
client = None

try:
  options = {
	"org": "sf1pr9",
	"id": "sniot-4",
	"auth-method": "apikey",
	"auth-key": "a-sf1pr9-4bwm1xlxgb",
	"auth-token": "fZBHSUQsU?o!gNrW0)"
	}
  client = ibmiotf.application.Client(options)
except ibmiotf.ConnectionException  as e:
	print e

class act:
	def __init__(self):
		self.last_val = 0 
	def r_callback(self, cmd):
		if cmd.event == "actuator":
			command = cmd.payload["sensor_status"]
			self.last_val = command
			print command
			if command == 1:
				GPIO.output(17, True)
			elif command == 0:
				GPIO.output(17, False)
		else:
			GPIO.output(17, self.last_val)
client.connect()
actuate = act()
client.deviceEventCallback = actuate.r_callback
while 1:
	client.subscribeToDeviceEvents()
	sleep(0.1)