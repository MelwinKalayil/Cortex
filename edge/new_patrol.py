import cv2
import json
import uuid
import time
import base64
import random
from datetime import datetime, timezone
import websocket
from shapely.geometry import Point, Polygon
from ultralytics import YOLO

# ==============================================================================
# CONFIGURATION & SIMULATION PARAMETERS
# ==============================================================================
BACKEND_WS_URL = "ws://172.18.236.189:8000/ws/alerts"  # Replace localhost with backend IP when networked
MODEL_PATH = "Final/best.onnx"                         # Path to your ONNX or .pt model
ALERT_COOLDOWN_SEC = 5                         # Prevent alert spamming
INPUT_WIDTH = 640
INPUT_HEIGHT = 640

# Expanded to cover the full university extent
CAMPUS_BOUNDARY = {
    "min_lat": 12.9690,
    "max_lat": 12.9705,
    "min_lon": 79.1550,
    "max_lon": 79.1575
}

# ==============================================================================
# GEOFENCED ZONES (Fully Translated from VIT predefinedRestrictedZones.js)
# ==============================================================================
DEFAULT_ZONES = [
    {
        "zone_id": "vit-univ-estates-office---cts",
        "zone_name": "VIT Univ Estates Office & CTS Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9702427, 79.1560957], [12.9701523, 79.1560886], [12.9701200, 79.1565215], [12.9702104, 79.1565286], [12.9702427, 79.1560957]
        ]
    },
    {
        "zone_id": "vit-lake",
        "zone_name": "VIT Lake",
        "zone_type": "RESTRICTED_GROUND",
        "severity": "HIGH",
        "restricted_classes": ["car", "bus", "truck", "van", "motor", "person"],
        "polygon": [
            [12.9686997, 79.1589860], [12.9687245, 79.1589330], [12.9687477, 79.1589152], [12.9688043, 79.1589060], [12.9696137, 79.1590442], 
            [12.9696944, 79.1590793], [12.9697265, 79.1591103], [12.9697656, 79.1591908], [12.9697664, 79.1596941], [12.9697870, 79.1597651], 
            [12.9698115, 79.1597928], [12.9698783, 79.1598207], [12.9701780, 79.1598529], [12.9702088, 79.1598702], [12.9702512, 79.1599266], 
            [12.9703878, 79.1612318], [12.9703656, 79.1612865], [12.9703454, 79.1613080], [12.9701738, 79.1613923], [12.9701081, 79.1614361], 
            [12.9700297, 79.1615489], [12.9699879, 79.1616534], [12.9699683, 79.1617599], [12.9699873, 79.1620793], [12.9699649, 79.1621216], 
            [12.9699216, 79.1621268], [12.9698589, 79.1620943], [12.9697723, 79.1620094], [12.9697048, 79.1619078], [12.9694173, 79.1613415], 
            [12.9689971, 79.1604562], [12.9689463, 79.1602789], [12.9686997, 79.1589860]
        ]
    },
    {
        "zone_id": "cs-hall",
        "zone_name": "CS Hall Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9701060, 79.1558585], [12.9702316, 79.1558589], [12.9702327, 79.1554919], [12.9701072, 79.1554915], [12.9701060, 79.1558585]
        ]
    },
    {
        "zone_id": "ev-periyar-library",
        "zone_name": "EV Periyar Library Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9694022, 79.1566523], [12.9692858, 79.1566509], [12.9692852, 79.1567066], [12.9691794, 79.1567054], [12.9691787, 79.1567744], 
            [12.9691548, 79.1567742], [12.9691532, 79.1569316], [12.9691720, 79.1569318], [12.9691714, 79.1570045], [12.9692852, 79.1570056], 
            [12.9692847, 79.1570598], [12.9693901, 79.1570607], [12.9693906, 79.1570051], [12.9694645, 79.1570058], [12.9694649, 79.1569554], 
            [12.9694885, 79.1569473], [12.9694920, 79.1567774], [12.9694581, 79.1567767], [12.9694594, 79.1567140], [12.9694010, 79.1567127], 
            [12.9694022, 79.1566523]
        ]
    },
    {
        "zone_id": "vit-women-s-indoor-sports-room",
        "zone_name": "VIT Women's Indoor Sports Room Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9707355, 79.1608356], [12.9706624, 79.1608473], [12.9706502, 79.1607666], [12.9706656, 79.1607641], [12.9706590, 79.1607209], 
            [12.9706436, 79.1607233], [12.9705964, 79.1604134], [12.9706815, 79.1603998], [12.9706686, 79.1603150], [12.9705570, 79.1603328], 
            [12.9705591, 79.1603465], [12.9704982, 79.1603562], [12.9705046, 79.1603985], [12.9704468, 79.1604078], [12.9705513, 79.1610945], 
            [12.9707695, 79.1610595], [12.9707355, 79.1608356]
        ]
    },
    {
        "zone_id": "cdmm-building",
        "zone_name": "CDMM Building Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9692196, 79.1552244], [12.9692302, 79.1552211], [12.9692380, 79.1552130], [12.9692411, 79.1552020], [12.9692386, 79.1551906], 
            [12.9692310, 79.1551820], [12.9692203, 79.1551782], [12.9692271, 79.1547571], [12.9692373, 79.1547514], [12.9692442, 79.1547419], 
            [12.9692467, 79.1547303], [12.9692443, 79.1547189], [12.9692377, 79.1547095], [12.9692280, 79.1547036], [12.9691042, 79.1547015], 
            [12.9690960, 79.1552223], [12.9692196, 79.1552244]
        ]
    },
    {
        "zone_id": "health-centre",
        "zone_name": "Health Centre Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9693708, 79.1545194], [12.9696407, 79.1545240], [12.9696395, 79.1546013], [12.9696128, 79.1546009], [12.9696114, 79.1546883], 
            [12.9695923, 79.1546880], [12.9695920, 79.1547108], [12.9695084, 79.1547094], [12.9695073, 79.1547733], [12.9693667, 79.1547709], 
            [12.9693708, 79.1545194]
        ]
    },
    {
        "zone_id": "b-block",
        "zone_name": "B Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9680270, 79.1578837], [12.9680247, 79.1579006], [12.9680181, 79.1579164], [12.9680077, 79.1579298], [12.9679933, 79.1579405], 
            [12.9679765, 79.1579467], [12.9679602, 79.1579461], [12.9679098, 79.1582147], [12.9679219, 79.1582247], [12.9679319, 79.1582369], 
            [12.9679424, 79.1582588], [12.9679462, 79.1582829], [12.9679461, 79.1582947], [12.9680368, 79.1582960], [12.9680510, 79.1582844], 
            [12.9681214, 79.1582854], [12.9681208, 79.1583245], [12.9680933, 79.1583241], [12.9680909, 79.1585063], [12.9680426, 79.1585057], 
            [12.9680437, 79.1584244], [12.9680365, 79.1584243], [12.9680372, 79.1583752], [12.9679217, 79.1583736], [12.9679221, 79.1583412], 
            [12.9678949, 79.1583408], [12.9678936, 79.1584320], [12.9679078, 79.1584322], [12.9679082, 79.1584017], [12.9680208, 79.1584033], 
            [12.9680194, 79.1585107], [12.9677270, 79.1585066], [12.9677297, 79.1583024], [12.9677922, 79.1583033], [12.9677924, 79.1582872], 
            [12.9677999, 79.1582873], [12.9678004, 79.1582526], [12.9678065, 79.1582526], [12.9678069, 79.1582191], [12.9678133, 79.1582192], 
            [12.9678138, 79.1581865], [12.9678225, 79.1581867], [12.9678229, 79.1581544], [12.9678277, 79.1581545], [12.9678281, 79.1581228], 
            [12.9678352, 79.1581229], [12.9678357, 79.1580893], [12.9678417, 79.1580894], [12.9678422, 79.1580558], [12.9678480, 79.1580559], 
            [12.9678484, 79.1580233], [12.9678551, 79.1580233], [12.9678556, 79.1579894], [12.9678633, 79.1579895], [12.9678637, 79.1579566], 
            [12.9678698, 79.1579567], [12.9678703, 79.1579240], [12.9678777, 79.1579241], [12.9678781, 79.1578914], [12.9678878, 79.1578916], 
            [12.9678887, 79.1578225], [12.9679751, 79.1578237], [12.9679752, 79.1578137], [12.9681051, 79.1578155], [12.9681045, 79.1578607], 
            [12.9681271, 79.1578611], [12.9681268, 79.1578851], [12.9681025, 79.1578847], [12.9681021, 79.1579152], [12.9680823, 79.1579150], 
            [12.9680825, 79.1578959], [12.9680543, 79.1578955], [12.9680544, 79.1578841], [12.9680270, 79.1578837]
        ]
    },
    {
        "zone_id": "j-block",
        "zone_name": "J Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9721388, 79.1578745], [12.9720700, 79.1579442], [12.9722224, 79.1581025], [12.9722198, 79.1581937], [12.9720895, 79.1583170], 
            [12.9721614, 79.1583971], [12.9722767, 79.1582879], [12.9723270, 79.1583439], [12.9723740, 79.1583198], [12.9725001, 79.1584541], 
            [12.9726121, 79.1583434], [12.9724844, 79.1582074], [12.9725028, 79.1581892], [12.9724610, 79.1581445], [12.9726197, 79.1579878], 
            [12.9725251, 79.1578869], [12.9723570, 79.1580529], [12.9723544, 79.1580274], [12.9723203, 79.1580311], [12.9723231, 79.1580582], 
            [12.9722969, 79.1580703], [12.9721388, 79.1578745]
        ]
    },
    {
        "zone_id": "h-block",
        "zone_name": "H Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9722392, 79.1571582], [12.9721608, 79.1572306], [12.9722784, 79.1573647], [12.9722836, 79.1574478], [12.9721293, 79.1575887], 
            [12.9722058, 79.1576770], [12.9723568, 79.1575390], [12.9724509, 79.1575471], [12.9725564, 79.1576770], [12.9726297, 79.1576144], 
            [12.9725032, 79.1574586], [12.9724875, 79.1573889], [12.9726412, 79.1572552], [12.9725761, 79.1571763], [12.9724274, 79.1573057], 
            [12.9723672, 79.1573111], [12.9722392, 79.1571582]
        ]
    },
    {
        "zone_id": "f-block",
        "zone_name": "F Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9741038, 79.1578832], [12.9741006, 79.1579674], [12.9741673, 79.1579700], [12.9741394, 79.1587099], [12.9740697, 79.1587071], 
            [12.9740654, 79.1588229], [12.9738423, 79.1588140], [12.9738476, 79.1586749], [12.9738049, 79.1586732], [12.9738313, 79.1579745], 
            [12.9738856, 79.1579766], [12.9738894, 79.1578746], [12.9741038, 79.1578832]
        ]
    },
    {
        "zone_id": "d-annexe",
        "zone_name": "D Annexe Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9731647, 79.1585778], [12.9731638, 79.1586133], [12.9731413, 79.1586127], [12.9731362, 79.1588079], [12.9731226, 79.1588075], 
            [12.9731207, 79.1588791], [12.9731336, 79.1588795], [12.9731278, 79.1591008], [12.9732513, 79.1591042], [12.9732569, 79.1588879], 
            [12.9733086, 79.1588893], [12.9733055, 79.1590071], [12.9733847, 79.1590093], [12.9733871, 79.1589159], [12.9734812, 79.1589185], 
            [12.9734799, 79.1589683], [12.9735391, 79.1589699], [12.9735396, 79.1589507], [12.9735870, 79.1589520], [12.9735890, 79.1588751], 
            [12.9735388, 79.1588738], [12.9735402, 79.1588213], [12.9732616, 79.1588136], [12.9732667, 79.1586157], [12.9732341, 79.1586148], 
            [12.9732350, 79.1585798], [12.9731647, 79.1585778]
        ]
    },
    {
        "zone_id": "mens-hostel-indoor-stadium",
        "zone_name": "Men's Hostel Indoor Stadium Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9720049, 79.1589548], [12.9721649, 79.1589589], [12.9721654, 79.1589389], [12.9723040, 79.1589424], [12.9722984, 79.1591734], 
            [12.9722571, 79.1591724], [12.9722508, 79.1594352], [12.9719934, 79.1594286], [12.9719988, 79.1592045], [12.9718766, 79.1592014], 
            [12.9718792, 79.1590940], [12.9720015, 79.1590971], [12.9720049, 79.1589548]
        ]
    },
    {
        "zone_id": "b-annexe",
        "zone_name": "B Annexe Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9750132, 79.1572241], [12.9749797, 79.1575196], [12.9748302, 79.1575017], [12.9748395, 79.1574194], [12.9748645, 79.1574223], 
            [12.9748886, 79.1572093], [12.9750132, 79.1572241]
        ]
    },
    {
        "zone_id": "paras-mahal",
        "zone_name": "Paras Mahal Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9669164, 79.1635073], [12.9669049, 79.1637080], [12.9664527, 79.1636805], [12.9664729, 79.1633318], [12.9670738, 79.1633684], 
            [12.9670653, 79.1635163], [12.9669164, 79.1635073]
        ]
    },
    {
        "zone_id": "vit-agri-clinic",
        "zone_name": "VIT Agri Clinic Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9668198, 79.1620423], [12.9667727, 79.1623105], [12.9666352, 79.1622851], [12.9666823, 79.1620169], [12.9668198, 79.1620423]
        ]
    },
    {
        "zone_id": "g-block",
        "zone_name": "G Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9682724, 79.1595847], [12.9682658, 79.1597832], [12.9678064, 79.1597671], [12.9678130, 79.1595686], [12.9682724, 79.1595847]
        ]
    },
    {
        "zone_id": "h-block-2",
        "zone_name": "H Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9677588, 79.1592950], [12.9676105, 79.1597362], [12.9674436, 79.1596772], [12.9675919, 79.1592360], [12.9677588, 79.1592950]
        ]
    },
    {
        "zone_id": "office-assistant-divisional-engineer",
        "zone_name": "Office of the Assistant Divisional Engineer Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9678891, 79.1562096], [12.9678415, 79.1561989], [12.9678563, 79.1561297], [12.9677909, 79.1561150], [12.9677593, 79.1562636], 
            [12.9678358, 79.1562808], [12.9678464, 79.1562311], [12.9678828, 79.1562392], [12.9678891, 79.1562096]
        ]
    },
    {
        "zone_id": "b-block-2",
        "zone_name": "B Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9746303, 79.1570422], [12.9745113, 79.1570268], [12.9743973, 79.1579540], [12.9745165, 79.1579694], [12.9746303, 79.1570422]
        ]
    },
    {
        "zone_id": "tt-annexe",
        "zone_name": "TT Annexe Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9709170, 79.1601506], [12.9709142, 79.1601314], [12.9709683, 79.1601230], [12.9709861, 79.1602439], [12.9709321, 79.1602523], 
            [12.9709291, 79.1602322], [12.9706779, 79.1602712], [12.9706658, 79.1601896], [12.9709170, 79.1601506]
        ]
    },
    {
        "zone_id": "p-block",
        "zone_name": "P Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9745532, 79.1642583], [12.9746376, 79.1641760], [12.9748820, 79.1641877], [12.9748798, 79.1642244], [12.9746489, 79.1642133], 
            [12.9746007, 79.1642604], [12.9746555, 79.1642629], [12.9746480, 79.1644402], [12.9731932, 79.1643756], [12.9731980, 79.1642618], 
            [12.9731629, 79.1642603], [12.9731649, 79.1642116], [12.9729813, 79.1642034], [12.9729778, 79.1641699], [12.9732877, 79.1641837], 
            [12.9733012, 79.1642027], [12.9734568, 79.1642096], [12.9734577, 79.1641863], [12.9743995, 79.1642281], [12.9743985, 79.1642514], 
            [12.9745532, 79.1642583]
        ]
    },
    {
        "zone_id": "m-annexe",
        "zone_name": "M Annexe Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9728955, 79.1646434], [12.9726772, 79.1646742], [12.9726664, 79.1645937], [12.9728847, 79.1645629], [12.9728955, 79.1646434]
        ]
    },
    {
        "zone_id": "r-block-wtp-hns-fire-pump-room",
        "zone_name": "R Block WTP HNS & Fire Pump Room Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9745183, 79.1637853], [12.9746414, 79.1637871], [12.9746395, 79.1639192], [12.9745984, 79.1639628], [12.9745158, 79.1639615], 
            [12.9745183, 79.1637853]
        ]
    },
    {
        "zone_id": "anna-auditorium",
        "zone_name": "Anna Auditorium Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9701072, 79.1554915], [12.9697859, 79.1554905], [12.9697848, 79.1558574], [12.9701060, 79.1558585], [12.9701072, 79.1554915]
        ]
    },
    {
        "zone_id": "j-block-2",
        "zone_name": "J Block Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9683125, 79.1590178], [12.9683003, 79.1593579], [12.9680429, 79.1593526], [12.9680483, 79.1590861], [12.9680495, 79.1590275], 
            [12.9683125, 79.1590178]
        ]
    },
    {
        "zone_id": "ruby-tower",
        "zone_name": "Ruby Tower Rooftop",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9717703, 79.1645193], [12.9719349, 79.1652006], [12.9706228, 79.1655412], [12.9705340, 79.1647527], [12.9717703, 79.1645193]
        ]
    }
]

# Universal Hazards (Triggers alerts regardless of geofencing)
CRITICAL_HAZARDS = {"fire", "smoke", "crash", "lying_person"}


# ==============================================================================
# 1. DRONE TELEMETRY & COORDINATE CONVERSION
# ==============================================================================
class SimulatedDrone:
    def __init__(self, altitude_m=30.0):
        self.lat = (CAMPUS_BOUNDARY["min_lat"] + CAMPUS_BOUNDARY["max_lat"]) / 2
        self.lon = (CAMPUS_BOUNDARY["min_lon"] + CAMPUS_BOUNDARY["max_lon"]) / 2
        self.altitude_m = altitude_m
        
        # 90-degree Field of View assumption: footprint width = 2 * altitude
        self.footprint_size_m = 2 * altitude_m
        # Approx 111,320 meters per degree of latitude
        self.footprint_deg = self.footprint_size_m / 111320.0

    def update_position(self):
        """Simulates autonomous drone patrol drift within campus geofence."""
        step = 0.00008  # ~9 meters per step
        self.lat += random.uniform(-step, step)
        self.lon += random.uniform(-step, step)
        
        self.lat = max(CAMPUS_BOUNDARY["min_lat"], min(self.lat, CAMPUS_BOUNDARY["max_lat"]))
        self.lon = max(CAMPUS_BOUNDARY["min_lon"], min(self.lon, CAMPUS_BOUNDARY["max_lon"]))
        return self.lat, self.lon


def pixel_to_gps(px_x, px_y, width, height, drone_lat, drone_lon, footprint_deg):
    """Maps nadir camera pixel (x, y) to estimated real-world GPS coordinates."""
    norm_x = px_x / width
    norm_y = px_y / height
    
    frame_min_lat = drone_lat - (footprint_deg / 2)
    frame_max_lat = drone_lat + (footprint_deg / 2)
    frame_min_lon = drone_lon - (footprint_deg / 2)
    frame_max_lon = drone_lon + (footprint_deg / 2)
    
    target_lon = frame_min_lon + (norm_x * (frame_max_lon - frame_min_lon))
    target_lat = frame_max_lat - (norm_y * (frame_max_lat - frame_min_lat))
    return round(target_lat, 6), round(target_lon, 6)


# ==============================================================================
# 2. GEOFENCE EVALUATION ENGINE
# ==============================================================================
class GeofenceEngine:
    def __init__(self, zones_data):
        self.active_zones = []
        self.load_zones(zones_data)

    def load_zones(self, zones_data):
        self.active_zones = []
        for zone in zones_data:
            self.active_zones.append({
                "id": zone["zone_id"],
                "name": zone["zone_name"],
                "type": zone["zone_type"],
                "severity": zone["severity"],
                "restricted_classes": zone["restricted_classes"],
                "polygon": Polygon(zone["polygon"])
            })

    def evaluate(self, class_name, target_lat, target_lon):
        """Evaluates whether detected coordinates violate an active zone rule."""
        target_point = Point(target_lat, target_lon)
        for zone in self.active_zones:
            if class_name in zone["restricted_classes"]:
                if zone["polygon"].contains(target_point):
                    event_type = "ROOFTOP_TRESPASS" if zone["type"] == "ROOFTOP" else "ZONE_BREACH"
                    return True, event_type, zone["name"], zone["severity"]
        return False, None, None, None


# ==============================================================================
# 3. WEBSOCKET DISPATCH HANDLER
# ==============================================================================
class AlertDispatcher:
    def __init__(self, url):
        self.url = url
        self.ws = None
        self.connect()

    def connect(self):
        try:
            self.ws = websocket.create_connection(self.url, timeout=2)
            print(f"[NETWORK] WebSocket connected to backend: {self.url}")
        except Exception as e:
            self.ws = None
            print(f"[WARNING] Backend unreachable ({e}). Operating in standalone mode.")

    def send(self, payload):
        if self.ws is None:
            self.connect()
            
        if self.ws and self.ws.connected:
            try:
                self.ws.send(json.dumps(payload))
                print(f"[ALERT DISPATCHED] Type: {payload['event_type']} | Class: {payload['details']['hazard_class']}")
            except Exception as e:
                print(f"[NETWORK ERROR] Dispatch failed: {e}")
                self.ws = None
        else:
            print(f"[OFFLINE LOG] Alert generated: {payload['event_type']}")


# ==============================================================================
# 4. MAIN INFERENCE & DISPATCH LOOP
# ==============================================================================
def main():
    print("[INFO] Initializing Cortex Edge Node...")
    drone = SimulatedDrone(altitude_m=30.0)
    geofence = GeofenceEngine(DEFAULT_ZONES)
    dispatcher = AlertDispatcher(BACKEND_WS_URL)

    try:
        model = YOLO(MODEL_PATH)
        print(f"[INFO] Successfully loaded model: {MODEL_PATH}")
    except Exception as e:
        print(f"[ERROR] Failed to load {MODEL_PATH}. Defaulting to yolov8n.pt: {e}")
        model = YOLO("yolov8n.pt")

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, INPUT_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, INPUT_HEIGHT)

    last_alert_timestamps = {}

    print("[SYSTEM READY] Cortex aerial surveillance operational. Press 'q' to terminate.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        current_time = time.time()
        drone_lat, drone_lon = drone.update_position()

        # Run YOLO inference
        results = model.predict(source=frame, imgsz=INPUT_WIDTH, conf=0.45, verbose=False)
        annotated_frame = results[0].plot()

        boxes = results[0].boxes
        if len(boxes) > 0:
            for box in boxes:
                cls_id = int(box.cls[0].item())
                class_name = model.names[cls_id].lower()
                conf = float(box.conf[0].item())

                # Bounding box bottom-center: contact point with ground/roof
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                contact_px_x = (x1 + x2) / 2.0
                contact_px_y = y2

                target_lat, target_lon = pixel_to_gps(
                    contact_px_x, contact_px_y,
                    INPUT_WIDTH, INPUT_HEIGHT,
                    drone_lat, drone_lon,
                    drone.footprint_deg
                )

                # Check security policies
                is_alert = False
                event_type = "GENERAL_HAZARD"
                severity = "MEDIUM"
                zone_tag = "Open_Campus_Area"

                if class_name in CRITICAL_HAZARDS:
                    is_alert = True
                    severity = "CRITICAL"
                    zone_tag = "N/A (Universal Threat)"
                    if class_name in ["fire", "smoke"]:
                        event_type = "FIRE_SMOKE_HAZARD"
                    elif class_name == "crash":
                        event_type = "VEHICLE_COLLISION"
                    elif class_name == "lying_person":
                        event_type = "MEDICAL_EMERGENCY"
                else:
                    breach, b_event, b_zone, b_sev = geofence.evaluate(class_name, target_lat, target_lon)
                    if breach:
                        is_alert = True
                        event_type = b_event
                        severity = b_sev
                        zone_tag = b_zone

                # Throttle repeated alerts per event type
                if is_alert:
                    cooldown_key = f"{event_type}_{zone_tag}"
                    last_time = last_alert_timestamps.get(cooldown_key, 0)
                    
                    if (current_time - last_time) > ALERT_COOLDOWN_SEC:
                        last_alert_timestamps[cooldown_key] = current_time

                        # Encode annotated snapshot to Base64
                        _, buffer = cv2.imencode(".jpg", annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 60])
                        b64_img = base64.b64encode(buffer).decode("utf-8")

                        payload = {
                            "event_id": f"evt_{uuid.uuid4().hex[:12]}",
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                            "event_type": event_type,
                            "severity": severity,
                            "details": {
                                "hazard_class": class_name,
                                "confidence": round(conf, 3),
                                "target_coordinates": [target_lat, target_lon],
                                "geofence_tag": zone_tag,
                                "drone_telemetry": {
                                    "latitude": round(drone_lat, 6),
                                    "longitude": round(drone_lon, 6),
                                    "altitude_m": drone.altitude_m
                                }
                            },
                            "snapshot_base64": b64_img
                        }

                        dispatcher.send(payload)

        # On-screen visual HUD for testing display
        cv2.putText(annotated_frame, f"DRONE GPS: {drone_lat:.5f}, {drone_lon:.5f}", (15, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        cv2.imshow("Cortex Edge Patrol", annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()